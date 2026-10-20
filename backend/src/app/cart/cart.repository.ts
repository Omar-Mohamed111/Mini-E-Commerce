import { ClientSession } from "mongoose";
import { Cart } from "./cart.model.js";

// بنجيب السلة الخاصة بالمستخدم.
// لو اتبعتت Session، قراءة السلة هتكون جزءًا من الـ Transaction.
export const findCartByUserId = async (
  userId: string,
  session?: ClientSession,
) => {
  return await Cart.findOne({ user: userId }).session(session ?? null);
};

// لو السلة مش موجودة، بننشئ سلة جديدة فاضية للمستخدم.
export const createCart = async (userId: string) => {
  return await Cart.create({ user: userId, items: [] });
};

// بنحفظ التعديلات اللي عملناها على مستند السلة.
export const saveCart = async (cart: InstanceType<typeof Cart>) => {
  return await cart.save();
};

// بنفضّي عناصر السلة الخاصة بالمستخدم.
// بنستخدم Session علشان تفريغ السلة يكون داخل نفس الـ Transaction.
export const clearCartByUserId = async (
  userId: string,
  session: ClientSession,
) => {
  return await Cart.updateOne(
    { user: userId }, // بنحدد السلة المطلوبة filter
    { $set: { items: [] } }, // بنخلي مصفوفة المنتجات فاضية
    { session }, // بنربط التحديث بنفس الـ Transaction
  );
};
