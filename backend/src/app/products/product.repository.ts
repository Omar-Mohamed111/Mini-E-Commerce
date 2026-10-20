import { Product } from "./product.model.js";

export const getAllProducts = async (
  page: number,
  limit: number,
  sort: string,
  category: string,
  search: string,
) => {
  const skip = (page - 1) * limit;
  const sortOption = sort === "-price" ? -1 : 1;
  const filter: any = {};

  if (category) {
    filter.category = category;
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
    ];
  }

  return await Product.find(filter)
    .sort({ price: sortOption })
    .skip(skip)
    .limit(limit);
};

// =====================

export const countProducts = async (category: string, search: string) => {
  
  const filter: any = {};
  
  if (category) {
    filter.category = category;
  }

  if (search) { 
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
    ];
  }

  return await Product.countDocuments(filter);
};
// ==========================================================================================

export const createProduct = async (data: any) => {
  return await Product.create(data);
};

// ==========================================================================================

export const getProductById = async (id: string) => {
  return await Product.findById(id);
};

// ==========================================================================================

export const updateProductById = async (id: string, data: any) => {
  return await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

// ==========================================================================================

export const deleteProductById = async (id: string) => {
  return await Product.findByIdAndDelete(id);
};
