import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../api/productService';
import { addToCart } from '../utils/cart';
import ReviewForm from '../components/ReviewForm';
import { AuthContext } from '../context/AuthContext';
import { formatCurrency } from '../utils/format';
import toast from "react-hot-toast";
import { 
  FaStar, 
  FaShoppingCart, 
  FaHeart, 
  FaShare, 
  FaTruck, 
  FaShieldAlt, 
  FaUndo,
  FaCheckCircle,
  FaArrowLeft,
  FaPlus,
  FaMinus
} from 'react-icons/fa';
import { HiSparkles, HiFire, HiClock } from 'react-icons/hi';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await getProductById(id);
      setProduct(data);
    } catch (err) {
      console.error("Product fetch error:", err);
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (product.countInStock < qty) {
      return toast.error("Not enough stock available");
    }

    setAddingToCart(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    addToCart({
      product: id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || product.image,
      qty
    });

    setAddingToCart(false);
    toast.success("Added to cart successfully!");
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(!isWishlisted ? "Added to wishlist" : "Removed from wishlist");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Product link copied to clipboard!");
  };

  const incrementQty = () => {
    if (qty < product.countInStock) {
      setQty(qty + 1);
    }
  };

  const decrementQty = () => {
    if (qty > 1) {
      setQty(qty - 1);
    }
  };

  const hasDiscount = product?.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const isTrending = product?.rating >= 4.5 && product?.numReviews > 20;
  const isLimitedStock = product?.countInStock < 10 && product?.countInStock > 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="h-96 bg-gray-200 rounded-2xl"></div>
                <div className="flex gap-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="h-20 bg-gray-200 rounded-lg flex-1"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const images = product.images || [product.image];
  const features = [
    { icon: FaTruck, text: "Free shipping on orders over ₹500", color: "text-green-500" },
    { icon: FaUndo, text: "30-day return policy", color: "text-blue-500" },
    { icon: FaShieldAlt, text: "2-year warranty included", color: "text-purple-500" },
    { icon: FaCheckCircle, text: "Authentic product guarantee", color: "text-emerald-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8">
      <div className="container mx-auto px-4">
        {/* Navigation */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors p-2 hover:bg-white rounded-xl"
          >
            <FaArrowLeft size={16} />
            Back
          </button>
          <div className="text-sm text-gray-500">
            <span className="hover:text-gray-700 cursor-pointer" onClick={() => navigate('/')}>Home</span>
            <span className="mx-2">/</span>
            <span className="hover:text-gray-700 cursor-pointer" onClick={() => navigate('/products')}>Products</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* LEFT - Product Images */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
              <div className="relative h-96 rounded-xl overflow-hidden">
                <img
                  src={images[selectedImage] || 'https://via.placeholder.com/600x600/ffffff/cccccc?text=Product+Image'}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {hasDiscount && (
                    <span className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-2 rounded-full text-sm font-bold shadow-lg">
                      -{discountPercentage}% OFF
                    </span>
                  )}
                  {product.isNew && (
                    <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                      <HiSparkles size={12} />
                      NEW ARRIVAL
                    </span>
                  )}
                  {isTrending && (
                    <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                      <HiFire size={12} />
                      TRENDING
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button
                    onClick={handleWishlistToggle}
                    className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                  >
                    {isWishlisted ? (
                      <FaHeart className="text-red-500" size={20} />
                    ) : (
                      <FaHeart className="text-gray-400 hover:text-red-500" size={20} />
                    )}
                  </button>
                  <button
                    onClick={handleShare}
                    className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                  >
                    <FaShare className="text-gray-400 hover:text-blue-500" size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl border-2 overflow-hidden transition-all duration-200 ${
                      selectedImage === index 
                        ? 'border-blue-500 ring-2 ring-blue-200' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT - Product Details */}
          <div className="space-y-6">
            {/* Product Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              {/* Category & Brand */}
              <div className="flex items-center gap-3 mb-4">
                {product.category && (
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                )}
                {product.brand && (
                  <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    {product.brand}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={`${
                          star <= Math.floor(product.rating || 0)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        size={18}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-gray-700">
                    {product.rating ? product.rating.toFixed(1) : "0.0"}
                  </span>
                </div>
                <span className="text-gray-500">•</span>
                <span className="text-gray-600">{product.numReviews || 0} reviews</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-600">{product.countInStock || 0} sold</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  {formatCurrency(product.price)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-2xl text-gray-500 line-through">
                      {formatCurrency(product.originalPrice)}
                    </span>
                    <span className="text-lg font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      Save {formatCurrency(product.originalPrice - product.price)}
                    </span>
                  </>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Availability</span>
                  <span className={`text-sm font-semibold ${
                    product.countInStock > 10 
                      ? "text-green-600" 
                      : product.countInStock > 0 
                      ? "text-orange-600" 
                      : "text-red-600"
                  }`}>
                    {product.countInStock > 10 
                      ? "In Stock" 
                      : product.countInStock > 0 
                      ? `Only ${product.countInStock} left` 
                      : "Out of Stock"
                    }
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      product.countInStock > 10 
                        ? "bg-green-500" 
                        : product.countInStock > 0 
                        ? "bg-orange-500" 
                        : "bg-red-500"
                    }`}
                    style={{ 
                      width: `${Math.min((product.countInStock / 50) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-xl">
                    <button
                      onClick={decrementQty}
                      disabled={qty <= 1}
                      className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <FaMinus size={14} />
                    </button>
                    <span className="w-12 text-center font-semibold text-gray-900 text-lg">
                      {qty}
                    </span>
                    <button
                      onClick={incrementQty}
                      disabled={qty >= product.countInStock}
                      className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <FaPlus size={14} />
                    </button>
                  </div>
                  <span className="text-sm text-gray-600">
                    Max: {product.countInStock} units
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={product.countInStock === 0 || addingToCart}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                >
                  {addingToCart ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <FaShoppingCart size={18} />
                      Add to Cart
                    </>
                  )}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.countInStock === 0}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Buy Now
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                {features.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <IconComponent className={feature.color} size={16} />
                      <span className="text-sm text-gray-600">{feature.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Product Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
              
              {product.features && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Key Features:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    {product.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h3>

            {product.reviews?.length ? (
              <div className="space-y-6">
                {product.reviews.map((review) => (
                  <div key={review._id} className="p-6 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {review.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{review.name}</div>
                          <div className="flex items-center gap-1 text-yellow-500">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <FaStar
                                key={star}
                                className={star <= review.rating ? "text-yellow-400" : "text-gray-300"}
                                size={14}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">💬</div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">No Reviews Yet</h4>
                <p className="text-gray-600 mb-6">Be the first to share your thoughts about this product!</p>
              </div>
            )}

            {user ? (
              <ReviewForm productId={id} onReviewAdded={fetchProduct} />
            ) : (
              <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-xl">
                <p className="text-gray-600 mb-3">
                  Please <button onClick={() => navigate('/login')} className="text-blue-600 font-semibold hover:underline">login</button> to write a review
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}