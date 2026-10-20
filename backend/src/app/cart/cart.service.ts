import * as cartRepository from "./cart.repository.js";
import { Product } from "../products/product.model.js";
import { AppError } from "../../pkg/errors/AppError.js";
// ====================
// Get Or Create Cart
// ====================
export const getOrCreateCart = async (userId: string) => {
  const cart = await cartRepository.findCartByUserId(userId);
  if (cart) {
    return cart;
  }

  return await cartRepository.createCart(userId);
};

// ====================
// Add Product To Cart
// ====================

export const addProductToCart = async (
  userId: string,
  productId: string,
  quantity: number,
) => {
  // // 1- Check Product
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError("Product Not Found", 404);
  }

  // // 2- Check Quantity
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new AppError("Invalid Quantity", 400);
  }

  const cart = await getOrCreateCart(userId);

  // // 3- Check If product Exist in cart
  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId,
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      product: product._id,
      quantity,
    });
  }

  return await cartRepository.saveCart(cart);
};


