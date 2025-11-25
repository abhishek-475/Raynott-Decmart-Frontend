import api from "./api";

// GET ALL PRODUCTS (no filters in backend yet)
export const getAllProducts = async () => {
  const res = await api.get("/products");
  return res.data;
};

// GET BRANDS
export const getBrands = async () => {
  const res = await api.get("/products/filters/brands");
  return res.data;
};

// GET PRODUCT BY ID
export const getProductById = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

// CREATE PRODUCT (Admin only)
export const createProduct = async (data) => {
  const res = await api.post("/products", data);
  return res.data;
};

// UPDATE PRODUCT (Admin only)
export const updateProduct = async (id, data) => {
  const res = await api.put(`/products/${id}`, data);
  return res.data;
};

// ADD REVIEW (User only)
export const addReview = async (productId, data) => {
  const res = await api.post(`/products/${productId}/review`, data);
  return res.data;
};

// Get all categories
export const getCategories = async () => {
  try {
    const res = await api.get("/products/categories");
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch categories" };
  }
};

// Delete Product (Admin only)
export const deleteProduct = async (id) => {
  try {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Delete failed" };
  }
};