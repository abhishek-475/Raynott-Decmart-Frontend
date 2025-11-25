import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadCart, saveCart, clearCart } from "../utils/cart";
import { formatCurrency } from "../utils/format";
import toast from "react-hot-toast";
import { 
  FaTrash, 
  FaPlus, 
  FaMinus, 
  FaShoppingBag, 
  FaArrowLeft,
  FaLock,
  FaShieldAlt,
  FaTruck,
  FaUndo
} from "react-icons/fa";
import { HiShoppingCart, HiSparkles } from "react-icons/hi";

export default function CartPage() {
  const [cart, setCart] = useState(loadCart());
  const [isClearing, setIsClearing] = useState(false);
  const navigate = useNavigate();

  const removeItem = (idx) => {
    const updated = cart.filter((_, i) => i !== idx);
    saveCart(updated);
    setCart(updated);
    toast.success("Item removed from cart");
  };

  const updateQuantity = (idx, newQty) => {
    if (newQty < 1) return;
    const updated = [...cart];
    updated[idx].qty = newQty;
    saveCart(updated);
    setCart(updated);
    toast.success("Quantity updated");
  };

  const incrementQty = (idx) => {
    updateQuantity(idx, cart[idx].qty + 1);
  };

  const decrementQty = (idx) => {
    if (cart[idx].qty > 1) {
      updateQuantity(idx, cart[idx].qty - 1);
    }
  };

  const clearAllItems = () => {
    setIsClearing(true);
    setTimeout(() => {
      clearCart();
      setCart([]);
      setIsClearing(false);
      toast.success("Cart cleared");
    }, 500);
  };

  const goToCheckout = () => {
    if (cart.length === 0) return toast.error("Your cart is empty!");
    navigate("/checkout");
  };

  const continueShopping = () => {
    navigate("/products");
  };

  const subtotal = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  const shippingFee = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shippingFee + tax;

  const cartItemsCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors p-2 hover:bg-white rounded-xl"
            >
              <FaArrowLeft size={16} />
              Back
            </button>
            <div className="w-1 h-8 bg-gray-300"></div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
              Shopping Cart
            </h1>
          </div>
          
          {cart.length > 0 && (
            <button
              onClick={clearAllItems}
              disabled={isClearing}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 disabled:opacity-50"
            >
              <FaTrash size={14} />
              Clear All
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Section */}
          <div className="lg:col-span-2">
            {/* Cart Summary Card */}
            {cart.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <HiShoppingCart className="text-white text-xl" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Your Cart ({cartItemsCount} {cartItemsCount === 1 ? 'item' : 'items'})
                      </h2>
                      <p className="text-sm text-gray-600">
                        Review and manage your items
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(total)}
                    </div>
                    <div className="text-sm text-gray-600">Total amount</div>
                  </div>
                </div>
              </div>
            )}

            {/* Empty Cart */}
            {cart.length === 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FaShoppingBag className="text-gray-400 text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Your cart is empty
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Looks like you haven't added any items to your cart yet. Start shopping to discover amazing products!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={continueShopping}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <HiSparkles size={16} />
                    Start Shopping
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <FaArrowLeft size={14} />
                    Back to Home
                  </button>
                </div>
              </div>
            )}

            {/* Cart Items List */}
            {cart.length > 0 && (
              <div className="space-y-4">
                {cart.map((item, idx) => (
                  <div
                    key={`${item.id}-${idx}`}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.image || "https://via.placeholder.com/100x100/ffffff/cccccc?text=Product"}
                          alt={item.name}
                          className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl bg-gray-100"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-900 text-lg truncate">
                            {item.name}
                          </h3>
                          <button
                            onClick={() => removeItem(idx)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>

                        {item.brand && (
                          <p className="text-sm text-gray-600 mb-2">
                            Brand: <span className="font-medium">{item.brand}</span>
                          </p>
                        )}

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-700">Quantity:</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => decrementQty(idx)}
                                className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                disabled={item.qty <= 1}
                              >
                                <FaMinus size={12} />
                              </button>
                              <span className="w-12 text-center font-semibold text-gray-900">
                                {item.qty}
                              </span>
                              <button
                                onClick={() => incrementQty(idx)}
                                className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                              >
                                <FaPlus size={12} />
                              </button>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">
                              {formatCurrency(item.qty * item.price)}
                            </div>
                            <div className="text-sm text-gray-600">
                              {formatCurrency(item.price)} each
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary */}
          {cart.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FaLock size={16} className="text-green-500" />
                  Order Summary
                </h3>

                {/* Pricing Breakdown */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartItemsCount} items)</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span className="flex items-center gap-2">
                      <FaTruck size={12} />
                      Shipping
                    </span>
                    <span>
                      {shippingFee === 0 ? (
                        <span className="text-green-600 font-semibold">FREE</span>
                      ) : (
                        formatCurrency(shippingFee)
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Tax (8%)</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>

                  {shippingFee === 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                      <p className="text-green-700 text-sm font-medium">
                        🎉 Free shipping on orders over $50!
                      </p>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={goToCheckout}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-3 mb-4"
                >
                  <FaLock size={16} />
                  Proceed to Checkout
                  <FaArrowLeft className="rotate-180" size={14} />
                </button>

                {/* Trust Badges */}
                <div className="text-center space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex justify-center gap-4 text-gray-500">
                    <div className="flex items-center gap-1 text-xs">
                      <FaShieldAlt size={12} />
                      Secure Payment
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <FaTruck size={12} />
                      Fast Delivery
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <FaUndo size={12} />
                      Easy Returns
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Your personal and payment info is always protected
                  </p>
                </div>

                {/* Continue Shopping */}
                <button
                  onClick={continueShopping}
                  className="w-full mt-4 border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <FaArrowLeft size={14} />
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}