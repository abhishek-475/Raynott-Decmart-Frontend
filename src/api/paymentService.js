import api from "./api";

// Create Razorpay Order
export const createRazorpayOrder = async (orderId) => {
  const res = await api.post("/payment/create-order", { orderId });
  return res.data;
};

// Verify Razorpay Payment
export const verifyPayment = async (data) => {
  const res = await api.post("/payment/verify", data);
  return res.data;
};

export default api;
