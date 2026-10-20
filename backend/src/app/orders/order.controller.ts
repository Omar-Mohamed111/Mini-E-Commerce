import { Request, Response, NextFunction } from "express";

import { createOrder } from "./order.service.js";

export const createMyOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // بنجيب هوية المستخدم اللي الـ authenticate middleware حطّها في req
    const userId = res.locals.userId;

    // بنطلب من الـ Service تنفيذ عملية إنشاء الأوردر
    const order = await createOrder(userId);

    // بنرجّع الأوردر للمستخدم بعد نجاح العملية
    res.status(201).json({
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    // بنمرر الخطأ للـ globalError middleware
    next(error);
  }
};
