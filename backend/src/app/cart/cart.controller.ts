import { NextFunction, Request, Response } from "express";
import * as cartService from "./cart.service.js";

export const getMyCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = res.locals.userId;

    const cart = await cartService.getOrCreateCart(userId);
    res.status(200).json({
      message: "Cart fetched successfully",
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// ===============================================

export const addToCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = res.locals.userId;
    const { productId, quantity } = req.body;

    const cart = await cartService.addProductToCart(
      userId,
      productId,
      quantity,
    );

    res.status(200).json({
      message: "Product added to cart successfully",
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};
