import React, { useState } from "react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../utils/format";
import { FaStar, FaHeart, FaEye, FaShoppingCart, FaRegHeart } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

export default function ProductCard({ p }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const hasDiscount = p.originalPrice && p.originalPrice > p.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
    : 0;

  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
      {/* Discount Badge */}
      {hasDiscount && (
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            -{discountPercentage}% OFF
          </span>
        </div>
      )}

      {/* New Badge */}
      {p.isNew && (
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
            <HiSparkles size={10} />
            NEW
          </span>
        </div>
      )}

      {/* Wishlist Button */}
      {/* <button
        onClick={handleWishlistToggle}
        className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110"
      >
        {isWishlisted ? (
          <FaHeart className="text-red-500" size={14} />
        ) : (
          <FaRegHeart className="text-gray-600 hover:text-red-500" size={14} />
        )}
      </button> */}

      {/* PRODUCT IMAGE */}
      <Link to={`/product/${p._id}`} className="block relative overflow-hidden">
        <div className="relative w-full h-60 bg-gray-100 rounded-t-2xl overflow-hidden">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
          
          <img
            src={imageError ? "https://via.placeholder.com/350x250/ffffff/cccccc?text=Product+Image" : p.image}
            alt={p.name}
            className={`w-full h-60 object-cover transition-all duration-500 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
          
          {/* Quick Actions Overlay */}
          {/* <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200">
                <FaEye className="text-gray-700" size={16} />
              </button>
              <button className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200">
                <FaShoppingCart className="text-white" size={16} />
              </button>
            </div>
          </div> */}
        </div>
      </Link>

      {/* PRODUCT INFO */}
      <div className="p-4">
        {/* Category */}
        {p.category && (
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            {p.category}
          </span>
        )}

        {/* Name */}
        <Link to={`/product/${p._id}`}>
          <h3 className="mt-2 font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors duration-200 min-h-[3rem]">
            {p.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center mt-2 mb-3">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`${
                  star <= Math.floor(p.rating || 0)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
                size={14}
              />
            ))}
          </div>
          <span className="text-sm text-gray-700 ml-2 font-medium">
            {p.rating ? p.rating.toFixed(1) : "0.0"}
          </span>
          <span className="text-xs text-gray-500 ml-1">
            ({p.numReviews || 0})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg font-bold text-gray-900">
            {formatCurrency(p.price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-500 line-through">
              {formatCurrency(p.originalPrice)}
            </span>
          )}
        </div>

        {/* Stock Status */}
        {p.countInStock !== undefined && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Available stock</span>
              <span>{p.countInStock} left</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full ${
                  p.countInStock > 10 
                    ? "bg-green-500" 
                    : p.countInStock > 0 
                    ? "bg-yellow-500" 
                    : "bg-red-500"
                }`}
                style={{ 
                  width: `${Math.min((p.countInStock / 50) * 100, 100)}%` 
                }}
              ></div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link
            to={`/product/${p._id}`}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold py-3 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <FaEye size={12} />
            View Details
          </Link>
          {/* <button className="w-12 h-12 border border-gray-300 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center">
            <FaShoppingCart className="text-gray-600 hover:text-blue-600" size={16} />
          </button> */}
        </div>
      </div>

      {/* Hover Border Effect */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-200 pointer-events-none transition-all duration-300"></div>
    </div>
  );
}