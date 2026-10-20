import mongoose from "mongoose";

import { AppError } from "../../pkg/errors/AppError.js";
import * as cartRepository from "../cart/cart.repository.js";
import * as orderRepository from "./order.repository.js";
import { Product } from "../products/product.model.js";

export const createOrder = async (userId: string) => {
  // 1. بنبدأ Session علشان نربط عمليات قاعدة البيانات بنفس الـ Transaction
  const session = await mongoose.startSession();

  try {
    // هنحتفظ بالأوردر علشان نرجّعه بعد نجاح الـ Transaction
    let order;
    // 2. بننفّذ عمليات الـ Checkout داخل Transaction واحدة
    await session.withTransaction(async () => {
      // 3. بنجيب سلة المستخدم باستخدام نفس الـ Session
      const cart = await cartRepository.findCartByUserId(userId, session);
      // لو السلة مش موجودة أو مفيهاش منتجات، نوقف العملية
      if (!cart || cart.items.length === 0) {
        throw new AppError("Cart Is Empty", 400);
      }

      // 4. بنجهّز مصفوفة لتفاصيل المنتجات اللي هتتحط في الأوردر
      const orderItems: {
        product: (typeof cart.items)[number]["product"];
        quantity: number;
        price: number;
      }[] = [];

      // 5. بنلف على كل منتج موجود في السلة
      for (const item of cart.items) {
        // بنجيب بيانات المنتج من قاعدة البيانات باستخدام نفس الـ Session
        const product = await Product.findById(item.product).session(session);

        // لو المنتج مش موجود، نوقف العملية
        if (!product) {
          throw new AppError("Product Not Found", 404);
        }

        // فحص أولي للتأكد إن المخزون كافي للكمية المطلوبة
        if (product.stock < item.quantity) {
          throw new AppError("Insufficient Stock", 400);
        }

        // 6. بنخصم الكمية بشرط إن المخزون لسه كافي وقت التحديث نفسه
        const result = await Product.updateOne(
          {
            _id: item.product,

            // $gte معناها إن المخزون أكبر من أو يساوي الكمية المطلوبة
            stock: { $gte: item.quantity },
          },
          {
            // القيمة السالبة بتقلل المخزون بالكمية المطلوبة
            $inc: { stock: -item.quantity },
          },
          {
            // بنربط خصم المخزون بنفس الـ Transaction
            session,
          },
        );

        // لو مفيش مستند اتعدّل، الخصم ما نجحش
        if (result.modifiedCount === 0) {
          throw new AppError("Insufficient Stock", 400);
        }

        // 7. بنضيف المنتج لتفاصيل الأوردر بسعره الحالي من قاعدة البيانات
        orderItems.push({
          product: item.product,
          quantity: item.quantity,
          price: product.price,
        });
      }

      // 8. بنحسب إجمالي الأوردر:
      // سعر كل منتج × كميته، وبعدها بنجمع أسعار كل المنتجات
      const totalPrice = orderItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );

      // 9. بننشئ الأوردر باستخدام نفس الـ Session
      const createdOrder = await orderRepository.createOrder(
        {
          user: userId,
          items: orderItems,
          totalPrice,
        },
        session,
      );

      // بنحتفظ بالأوردر علشان نرجّعه بعد نجاح الـ Transaction
      order = createdOrder;

      // 10. بنفضّي السلة بعد إنشاء الأوردر
      // لو العملية فشلت، التغييرات المرتبطة بالـ Transaction هتتلغي
      await cartRepository.clearCartByUserId(userId, session);
    });

    // 11. بنرجّع الأوردر بعد نجاح الـ Transaction
    return order;
  } finally {
    // 12. بننهي الـ Session سواء العملية نجحت أو حصل خطأ
    await session.endSession();
  }
};
