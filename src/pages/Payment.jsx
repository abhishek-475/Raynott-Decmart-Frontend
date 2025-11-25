import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { verifyPayment } from "../api/paymentService";
import api from "../api/paymentService";
import { clearCart } from "../utils/cart";

export default function Payment() {
  const loc = useLocation();
  const navigate = useNavigate();
  const { razorOrder, shipping, cart, totalPrice } = loc.state || {};

  useEffect(() => {
    if (!razorOrder) {
      navigate("/");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: razorOrder.amount,
      currency: razorOrder.currency,
      name: "Raynott Decmart",
      description: "Order Payment",
      order_id: razorOrder.id,

      handler: async (response) => {
        try {
          toast.loading("Verifying payment...");

          // 1️⃣ Verify payment on backend
          const verifyRes = await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId: razorOrder.id,
          });

          // 2️⃣ Create Order in DB
          await api.post("/orders", {
            orderItems: cart.map((i) => ({
              product: i.product,
              qty: i.qty,
              price: i.price,
            })),
            shippingInfo: shipping,
            totalPrice,
            paymentInfo: {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              status: "Paid",
            },
          });

          clearCart();

          toast.dismiss();
          toast.success("Payment successful!");
          navigate("/orders");
        } catch (err) {
          console.error("Payment verification failed:", err);
          toast.dismiss();
          toast.error("Payment verification failed!");
        }
      },

      prefill: {
        name: JSON.parse(localStorage.getItem("user") || "{}").name || "",
        email: JSON.parse(localStorage.getItem("user") || "{}").email || "",
      },

      theme: {
        color: "#2563eb",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

    return () => {};
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-700 text-lg animate-pulse">
        Opening payment...
      </p>
    </div>
  );
}
