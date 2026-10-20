import express from "express";
import { globalError } from "./pkg/errors/globalError.js";
import cors from "cors";
import prductsRoute from "./app/products/product.route.js";
import authRoute from "./app/auth/auth.route.js";
import cookieParser from "cookie-parser";
import cartRouter from "./app/cart/cart.route.js";
import ordersRoute from "./app/orders/order.route.js";
import { correlationId } from "./middleware/correlationId.js";
import { connectDatabase } from "./lib/database/connection.js";
import mongoose from "mongoose";


const app = express();
app.use(correlationId);
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(cookieParser());

// =========================================================================

let dbConnectionPromise: Promise<unknown> | null = null;

app.use(async (_req, _res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      dbConnectionPromise ??= connectDatabase().catch((error) => {
        dbConnectionPromise = null;
        throw error;
      });

      await dbConnectionPromise;
    }

    next();
  } catch (error) {
    next(error);
  }
});


app.use("/products", prductsRoute);

app.use("/auth", authRoute);

app.use("/cart", cartRouter);

app.use("/orders", ordersRoute);
// =========================================================================

app.use((req, res, _next) => {
  res.status(404).json({
    message: "Route Not Found",
  });
});

app.use(globalError);

export default app;
