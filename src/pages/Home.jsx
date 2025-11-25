import React, { useEffect, useState } from "react";
import { getAllProducts } from "../api/productService";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";
import { 
  FaTruck, 
  FaUndo, 
  FaShieldAlt, 
  FaHeadset,
  FaStar,
  FaArrowRight,
  FaShoppingBag,
  FaMobileAlt,
  FaTshirt,
  FaHome,
  FaFutbol,
  FaGem,
  FaBook
} from "react-icons/fa";
import { 
  HiSparkles, 
  HiShoppingCart 
} from "react-icons/hi";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const data = await getAllProducts();
        setFeatured((data.products || data).slice(0, 8));
      } catch (err) {
        console.error("Featured fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const categories = [
    { name: "Electronics", icon: <FaMobileAlt className="text-2xl" />, color: "from-blue-500 to-cyan-500", path: "/products?category=Electronics" },
    { name: "Clothing", icon: <FaTshirt className="text-2xl" />, color: "from-pink-500 to-rose-500", path: "/products?category=Clothing" },
    { name: "Home & Garden", icon: <FaHome className="text-2xl" />, color: "from-green-500 to-emerald-500", path: "/products?category=Home" },
    { name: "Sports", icon: <FaFutbol className="text-2xl" />, color: "from-orange-500 to-red-500", path: "/products?category=Sports" },
    { name: "Beauty", icon: <FaGem className="text-2xl" />, color: "from-purple-500 to-pink-500", path: "/products?category=Beauty" },
    { name: "Books", icon: <FaBook className="text-2xl" />, color: "from-yellow-500 to-amber-500", path: "/products?category=Books" },
  ];

  const features = [
    { icon: <FaTruck className="text-2xl" />, title: "Free Shipping", desc: "On orders over $50" },
    { icon: <FaUndo className="text-2xl" />, title: "Easy Returns", desc: "30-day return policy" },
    { icon: <FaShieldAlt className="text-2xl" />, title: "Secure Payment", desc: "100% secure transaction" },
    { icon: <FaHeadset className="text-2xl" />, title: "24/7 Support", desc: "Always here to help" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Enhanced Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl"></div>
        
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <div className="flex items-center mb-4">
                <HiSparkles className="text-yellow-300 text-xl mr-2" />
                <span className="text-blue-200 font-semibold">Premium Shopping Experience</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Discover Amazing
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                  Products
                </span>
              </h1>
              <p className="text-xl mb-8 text-blue-100 max-w-lg">
                Shop from thousands of products with exclusive deals, fast delivery, and premium quality guaranteed!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  <HiShoppingCart className="text-lg" />
                  Shop Now
                </Link>
                <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2">
                  Learn More
                  <FaArrowRight />
                </button>
              </div>
            </div>
            
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl backdrop-blur-sm border border-white/20 shadow-2xl flex items-center justify-center">
                  <FaShoppingBag className="text-white text-8xl opacity-80" />
                </div>
                <div className="absolute -top-4 -right-4 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg">
                  <FaStar className="text-yellow-600" />
                  Trusted by 10K+ Customers
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-800">Featured Products</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Handpicked selection of premium products just for you
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featured.map((p) => (
              <ProductCard key={p._id} p={p} />
            ))}
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            View All Products
            <FaArrowRight />
          </Link>
        </div>
      </div>

      {/* Enhanced Categories Section */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">Shop by Category</h2>
            <p className="text-xl text-gray-600">Explore our wide range of categories</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Link 
                key={index}
                to={category.path}
                className="group"
              >
                <div className="bg-white rounded-2xl p-6 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${category.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl mb-8 text-blue-100">Get the latest deals and product updates</p>
          <div className="max-w-md mx-auto flex gap-4">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-blue-300 text-gray-800"
            />
            <button className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-yellow-300 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}