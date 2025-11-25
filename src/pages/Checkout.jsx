import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadCart } from '../utils/cart';
import { createOrder } from '../api/orderService';
import { createRazorpayOrder } from '../api/paymentService';
import toast from "react-hot-toast";
import { 
  FaLock, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaCity, 
  FaHome,
  FaShippingFast,
  FaShieldAlt,
  FaArrowLeft,
  FaCreditCard
} from 'react-icons/fa';
import { HiLocationMarker, HiReceiptRefund } from 'react-icons/hi';

export default function Checkout() {
  const navigate = useNavigate();
  const cart = loadCart();
  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shippingFee = totalPrice > 500 ? 0 : 49;
  const tax = totalPrice * 0.18; // 18% GST
  const finalTotal = totalPrice + shippingFee + tax;

  const [shipping, setShipping] = useState({
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!shipping.phone || shipping.phone.length < 10) {
      toast.error("Please enter a valid 10-digit phone number");
      setIsSubmitting(false);
      return;
    }

    // Validate all fields
    const requiredFields = ['address', 'city', 'state', 'pincode'];
    const missingField = requiredFields.find(field => !shipping[field]);
    if (missingField) {
      toast.error(`Please fill in the ${missingField} field`);
      setIsSubmitting(false);
      return;
    }

    try {
      toast.loading("Creating your order...", { duration: 3000 });

      const order = await createOrder({
        orderItems: cart.map(item => ({
          product: item.product,
          qty: item.qty,
          price: item.price,
        })),
        shippingInfo: shipping,
        totalPrice: finalTotal,
      });

      const paymentRes = await createRazorpayOrder(order._id);

      toast.dismiss();
      toast.success("Redirecting to secure payment...");

      navigate("/payment", {
        state: { 
          razorOrder: paymentRes.razorOrder, 
          shipping, 
          cart, 
          totalPrice: finalTotal, 
          orderId: order._id 
        },
      });

    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error("Failed to process order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors p-2 hover:bg-white rounded-xl"
            >
              <FaArrowLeft size={16} />
              Back to Cart
            </button>
            <div className="w-1 h-8 bg-gray-300"></div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
              Checkout
            </h1>
          </div>
          
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
            <FaLock size={14} className="text-green-500" />
            Secure Checkout
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Shipping Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
              {/* Form Header */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <FaShippingFast className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Shipping Information</h2>
                  <p className="text-gray-600">Enter your delivery details</p>
                </div>
              </div>

              <form onSubmit={submit} className="space-y-6">
                {/* Address Field */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FaMapMarkerAlt className="text-blue-500" size={14} />
                    Full Address
                  </label>
                  <input
                    required
                    value={shipping.address}
                    onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                    placeholder="Enter your complete address with street, building, etc."
                    className="w-full border border-gray-300 focus:border-blue-500 focus:ring-3 focus:ring-blue-200 p-4 rounded-xl transition-all duration-200 placeholder-gray-400"
                  />
                </div>

                {/* City & State */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <FaCity className="text-blue-500" size={14} />
                      City
                    </label>
                    <input
                      required
                      value={shipping.city}
                      onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                      placeholder="Enter your city"
                      className="w-full border border-gray-300 focus:border-blue-500 focus:ring-3 focus:ring-blue-200 p-4 rounded-xl transition-all duration-200 placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <FaHome className="text-blue-500" size={14} />
                      State
                    </label>
                    <input
                      required
                      value={shipping.state}
                      onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                      placeholder="Enter your state"
                      className="w-full border border-gray-300 focus:border-blue-500 focus:ring-3 focus:ring-blue-200 p-4 rounded-xl transition-all duration-200 placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Pincode & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <HiLocationMarker className="text-blue-500" size={14} />
                      Pincode
                    </label>
                    <input
                      required
                      value={shipping.pincode}
                      onChange={(e) => setShipping({ ...shipping, pincode: e.target.value })}
                      placeholder="Enter 6-digit pincode"
                      className="w-full border border-gray-300 focus:border-blue-500 focus:ring-3 focus:ring-blue-200 p-4 rounded-xl transition-all duration-200 placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <FaPhone className="text-blue-500" size={14} />
                      Phone Number
                    </label>
                    <input
                      required
                      type="tel"
                      value={shipping.phone}
                      onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                      placeholder="Enter 10-digit phone number"
                      className="w-full border border-gray-300 focus:border-blue-500 focus:ring-3 focus:ring-blue-200 p-4 rounded-xl transition-all duration-200 placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex flex-wrap gap-4 justify-center text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <FaLock className="text-green-500" size={12} />
                      SSL Secure
                    </div>
                    <div className="flex items-center gap-2">
                      <FaShieldAlt className="text-blue-500" size={12} />
                      Payment Protection
                    </div>
                    <div className="flex items-center gap-2">
                      <HiReceiptRefund className="text-orange-500" size={14} />
                      Easy Returns
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FaCreditCard className="text-blue-500" size={16} />
                Order Summary
              </h3>

              {/* Order Items */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cart.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-b-0">
                    <img
                      src={item.image || "https://via.placeholder.com/60x60/ffffff/cccccc?text=Product"}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg bg-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{item.name}</p>
                      <p className="text-gray-600 text-xs">Qty: {item.qty} × ₹{item.price}</p>
                    </div>
                    <div className="font-semibold text-gray-900 text-sm">
                      ₹{(item.qty * item.price).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-green-600 font-semibold">FREE</span>
                    ) : (
                      `₹${shippingFee}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Tax (GST 18%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>

                {shippingFee === 0 && totalPrice < 500 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                    <p className="text-green-700 text-sm font-medium">
                      Add ₹{(500 - totalPrice).toFixed(2)} more for free shipping!
                    </p>
                  </div>
                )}

                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>₹{finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={submit}
                disabled={isSubmitting || cart.length === 0}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 mb-4"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaLock size={16} />
                    Continue to Payment
                    <FaCreditCard size={14} />
                  </>
                )}
              </button>

              {/* Security Note */}
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  🔒 Your payment details are secure and encrypted
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}