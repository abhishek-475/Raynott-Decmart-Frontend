// pages/Home.jsx
import React, { useEffect, useState, useCallback } from "react";
import { getAllProducts } from "../api/productService";
import ProductCard from "../components/ProductCard";
import SearchFilter from "../components/SearchFilter";
import { 
  FiFilter, 
  FiX, 
  FiGrid, 
  FiList,
  FiChevronDown,
  FiRefreshCw
} from "react-icons/fi";
import { 
  HiSortAscending, 
  HiSparkles,
  HiFire
} from "react-icons/hi";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    brand: "",
    category: "",
    maxPrice: ""
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [sortBy, setSortBy] = useState("featured");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Fetch products with filters
  const fetchProducts = useCallback(async (currentFilters = {}) => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllProducts(currentFilters);
      setProducts(data.products || data);
      setFilteredProducts(data.products || data);
    } catch (err) {
      console.error("Products fetch error:", err);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    fetchProducts(newFilters);
  }, [fetchProducts]);

  // Sort products
  const sortProducts = useCallback((products, sortType) => {
    const sorted = [...products];
    switch (sortType) {
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price);
      case "rating":
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "name":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "newest":
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default:
        return sorted; // featured
    }
  }, []);

  // Client-side filtering and sorting
  useEffect(() => {
    let filtered = products;

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Brand filter
    if (filters.brand) {
      filtered = filtered.filter(product => product.brand === filters.brand);
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Price filter
    if (filters.maxPrice) {
      filtered = filtered.filter(product => product.price <= parseInt(filters.maxPrice));
    }

    // Apply sorting
    filtered = sortProducts(filtered, sortBy);

    setFilteredProducts(filtered);
  }, [products, filters, sortBy, sortProducts]);

  const productCount = filteredProducts.length;
  const hasFilters = filters.search || filters.brand || filters.category || filters.maxPrice;

  const sortOptions = [
    { value: "featured", label: "Featured", icon: HiSparkles },
    { value: "newest", label: "Newest" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Top Rated" },
    { value: "name", label: "Name: A to Z" },
  ];

  const clearAllFilters = () => {
    handleFilterChange({
      search: "",
      brand: "",
      category: "",
      maxPrice: ""
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <HiFire className="text-2xl text-orange-500" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                Featured Products
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl">
              Discover our carefully curated collection of premium products with exclusive deals and fast shipping.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-gray-900">{products.length}</div>
              <div className="text-sm text-gray-500">Total Products</div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-green-600">{productCount}</div>
              <div className="text-sm text-gray-500">Showing</div>
            </div>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Mobile Filter Toggle */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                showMobileFilters 
                  ? "bg-blue-600 text-white shadow-lg" 
                  : "bg-white text-gray-700 shadow-sm hover:shadow-md border border-gray-200"
              } ${hasFilters ? "ring-2 ring-blue-200" : ""}`}
            >
              {showMobileFilters ? <FiX size={18} /> : <FiFilter size={18} />}
              Filters
              {hasFilters && (
                <span className="bg-blue-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  ●
                </span>
              )}
            </button>

            {/* Refresh Button */}
            <button
              onClick={() => fetchProducts(filters)}
              className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl font-semibold text-gray-700 hover:shadow-md transition-all duration-200"
            >
              <FiRefreshCw size={16} />
            </button>
          </div>

          <div className="flex-1"></div>

          {/* View Controls */}
          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl font-semibold text-gray-700 hover:shadow-md transition-all duration-200 min-w-[180px] justify-between"
              >
                <div className="flex items-center gap-2">
                  <HiSortAscending size={16} />
                  <span>
                    {sortOptions.find(opt => opt.value === sortBy)?.label}
                  </span>
                </div>
                <FiChevronDown size={16} className={`transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showSortDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-10"
                    onClick={() => setShowSortDropdown(false)}
                  />
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-200 z-20 py-2">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setShowSortDropdown(false);
                        }}
                        className={`flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                          sortBy === option.value 
                            ? "text-blue-600 bg-blue-50 font-semibold" 
                            : "text-gray-700"
                        }`}
                      >
                        {option.icon && <option.icon size={16} />}
                        {option.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* View Toggle */}
            <div className="flex bg-white rounded-xl border border-gray-200 p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "grid" 
                    ? "bg-blue-600 text-white shadow-sm" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <FiGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "list" 
                    ? "bg-blue-600 text-white shadow-sm" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <FiList size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block lg:w-80 flex-shrink-0">
            <SearchFilter 
              onFilterChange={handleFilterChange}
              filters={filters}
            />
          </div>

          {/* Mobile Filters */}
          {showMobileFilters && (
            <div className="lg:hidden">
              <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowMobileFilters(false)} />
              <div className="fixed top-0 left-0 h-full w-80 bg-white z-50 overflow-y-auto shadow-2xl">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Filters</h3>
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <FiX size={20} />
                    </button>
                  </div>
                  <SearchFilter 
                    onFilterChange={handleFilterChange}
                    filters={filters}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Products Section */}
          <div className="flex-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600 font-medium">Loading amazing products...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="text-red-400 text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
                <button
                  onClick={() => fetchProducts(filters)}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  Try Again
                </button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="text-gray-300 text-8xl mb-6">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {hasFilters ? "No products match your filters" : "No products available"}
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {hasFilters 
                    ? "Try adjusting your search terms or filters to find what you're looking for."
                    : "Check back soon for new arrivals!"
                  }
                </p>
                {hasFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Active Filters & Results Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-600">
                      Showing {productCount} of {products.length} products
                    </span>
                    {hasFilters && (
                      <button
                        onClick={clearAllFilters}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  {/* Active Filters */}
                  {hasFilters && (
                    <div className="flex flex-wrap gap-2">
                      {filters.search && (
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                          Search: "{filters.search}"
                          <button
                            onClick={() => handleFilterChange({ ...filters, search: "" })}
                            className="ml-2 hover:text-blue-600 transition-colors"
                          >
                            ×
                          </button>
                        </span>
                      )}
                      {filters.brand && (
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                          Brand: {filters.brand}
                          <button
                            onClick={() => handleFilterChange({ ...filters, brand: "" })}
                            className="ml-2 hover:text-green-600 transition-colors"
                          >
                            ×
                          </button>
                        </span>
                      )}
                      {filters.category && (
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200">
                          Category: {filters.category}
                          <button
                            onClick={() => handleFilterChange({ ...filters, category: "" })}
                            className="ml-2 hover:text-purple-600 transition-colors"
                          >
                            ×
                          </button>
                        </span>
                      )}
                      {filters.maxPrice && (
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-orange-100 text-orange-800 border border-orange-200">
                          Max: ₹{filters.maxPrice}
                          <button
                            onClick={() => handleFilterChange({ ...filters, maxPrice: "" })}
                            className="ml-2 hover:text-orange-600 transition-colors"
                          >
                            ×
                          </button>
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Products Grid/List */}
                <div className={
                  viewMode === "grid" 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "space-y-4"
                }>
                  {filteredProducts.map((product) => (
                    <ProductCard 
                      key={product._id} 
                      p={product}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}