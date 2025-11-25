import api from "./api";

// CREATE ORDER
export const createOrder = async (data) => {
  const res = await api.post("/orders", data);
  return res.data;
};

// GET USER ORDERS
export const getMyOrders = async () => {
  const res = await api.get("/orders/myorders");
  return res.data;
};

// GET ORDER BY ID
export const getOrderById = async (id) => {
  const res = await api.get(`/orders/${id}`);
  return res.data;
};

// GET ALL ORDERS (Admin)
export const getAllOrders = async () => {
  const res = await api.get("/orders");
  return res.data;
};

// UPDATE ORDER STATUS (Admin)
export const updateOrderStatus = async (id, status) => {
  const res = await api.put(`/orders/status/${id}`, { status });
  return res.data;
};
