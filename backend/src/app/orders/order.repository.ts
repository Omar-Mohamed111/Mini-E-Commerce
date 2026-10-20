import mongoose, { ClientSession } from "mongoose";
import { Order } from "./order.model.js";

export const createOrder = async (
  orderData: {
    user: string;
    items: {
      product: mongoose.Types.ObjectId;
      quantity: number;
      price: number;
    }[];
    totalPrice: number;
  },
  session: ClientSession,
) => {
  const [order] = await Order.create([orderData], { session });

  return order;
};
