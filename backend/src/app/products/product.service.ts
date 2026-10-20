import {
  deleteCacheByPattern,
  getCache,
  setCache,
} from "../../lib/cache/cache.service.js";
import { productError } from "./product.errors.js";
import * as productRepository from "./product.repository.js";
import { unlink } from "node:fs/promises";
import path from "node:path";

export const getAllProducts = async (
  page: number,
  limit: number,
  sort: string,
  category: string,
  search: string,
) => {
  // // key cache
  const cacheKey = `products:list:${JSON.stringify({ page, limit, sort, category, search })}`;

  // 1. Check Redis Cache

  const cachedData = await getCache(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  // 2. Get products from MongoDB
  const allProducts = await productRepository.getAllProducts(
    page,
    limit,
    sort,
    category,
    search,
  );

  const totalProducts = await productRepository.countProducts(category, search);

  const totalPages = Math.ceil(totalProducts / limit);
  if (page > totalPages) {
    throw productError.pageNotFound();
  }

  const result = {
    products: allProducts,
    pagination: {
      totalProducts,
      currentPage: page,
      limit,
      totalPages,
    },
  };

  // 3. Save result in Redis for 60 seconds
  await setCache(cacheKey, result, 60);

  return result;
};
// ==========================================================================================

export const createProduct = async (data: any) => {
  const newProduct = await productRepository.createProduct(data);
  await deleteCacheByPattern("products:list:*");
  return newProduct;
};

// ==========================================================================================

export const getProductById = async (id: string) => {
  const product = await productRepository.getProductById(id);
  if (!product) {
    throw productError.productNotFound();
  }
  return product;
};

// ==========================================================================================

export const updateProductById = async (id: string, data: any) => {
  // 1. Get the existing product

  const existingProduct = await productRepository.getProductById(id);
  if (!existingProduct) {
    throw productError.productNotFound();
  }

  // 2. Save the old image path
  // oldImage = "/uploads/old-ring.jpg";
  const oldImage = existingProduct.image;

  // 3. Update the product in MongoDB

  const updatedProduct = await productRepository.updateProductById(id, data);
  if (!updatedProduct) {
    throw productError.productNotFound();
  }

  // 4. Delete the old image if a new image was uploaded
  if (data.image && oldImage && data.image !== oldImage) {
    const oldImagePath = path.join(
      path.resolve("uploads"),
      path.basename(oldImage),
    );

    try {
      await unlink(oldImagePath);
    } catch (error) {
      console.error("Failed to delete old product image:", error);
    }
  }

  // 5. Invalidate the products cache
  await deleteCacheByPattern("products:list:*");

  // 6. Return the updated product
  return updatedProduct;
};
// ==========================================================================================

export const deleteProductById = async (id: string) => {
  // 1. Delete the product from MongoDB
  const product = await productRepository.deleteProductById(id);

  if (!product) {
    throw productError.productNotFound();
  }

  // 2. Delete the product image from uploads folder
  if (product.image) {
    const imagePath = path.join(
      path.resolve("uploads"),
      path.basename(product.image),
    );

    try {
      await unlink(imagePath);
    } catch (error) {
      console.error("Failed to delete product image:", error);
    }
  }

  // 3. Invalidate products cache
  await deleteCacheByPattern("products:list:*");

  // 4. Return deleted product
  return product;
};
