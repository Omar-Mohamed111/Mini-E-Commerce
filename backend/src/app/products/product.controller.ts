import { NextFunction, Response, Request } from "express";
import * as productService from "./product.service.js";

export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { page, limit, sort, category, search } = res.locals.validatedQuery;

    const allProducts = await productService.getAllProducts(
      page,
      limit,
      sort,
      category,
      search,
    );
    res.status(200).json({
      message: "All products",
      data: allProducts,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================================================================

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const image = req.file ? `uploads/${req.file.filename}` : null;

    const newProduct = await productService.createProduct({
      ...req.body,
      image,
    });

    res.status(201).json({
      message: "New product",
      data: newProduct,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================================================================

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    
    const id = res.locals.validatedParams.id;
    const product = await productService.getProductById(id);

    res.status(200).json({
      message: "Product retrieved successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================================================================

export const updateProductById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = res.locals.validatedParams.id;
    const data = { ...req.body };

    if (req.file) {
      data.image = `uploads/${req.file.filename}`;
    }

    const product = await productService.updateProductById(id, data);

    res.status(200).json({
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================================================================

export const deleteProductById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = res.locals.validatedParams.id;

    const product = await productService.deleteProductById(id);

    res.status(200).json({
      message: "Product deleted successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};
