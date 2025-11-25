import React, { useState, useEffect } from 'react';
import { getBrands, getCategories } from '../api/productService';
import { 
  FaSearch, 
  FaFilter, 
  FaTimes, 
  FaTag, 
  FaStar,
  FaRupeeSign,
  FaBolt
} from 'react-icons/fa';
import { HiSparkles, HiRefresh } from 'react-icons/hi';

export default function SearchFilter({ 
  onFilterChange, 
  filters,
  className = '' 
}) {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [localSearch, setLocalSearch] = useState(filters.search || '');

  // Load brands and categories
  useEffect(() => {
    const loadFilters = async () => {
      setLoading(true);
      try {
        const [brandsData, categoriesData] = await Promise.all([
          getBrands(),
          getCategories()
        ]);
        setBrands(brandsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to load filters:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFilters();
  }, []);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localSearch !== filters.search) {
        onFilterChange({ ...filters, search: localSearch });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [localSearch, filters, onFilterChange]);

  const handleSearchChange = (e) => {
    setLocalSearch(e.target.value);
  };

  const handleBrandChange = (brand) => {
    onFilterChange({ ...filters, brand: filters.brand === brand ? '' : brand });
  };

  const handleCategoryChange = (category) => {
    onFilterChange({ ...filters, category: filters.category === category ? '' : category });
  };

  const handlePriceRangeChange = (maxPrice) => {
    onFilterChange({ ...filters, maxPrice: filters.maxPrice === maxPrice ? '' : maxPrice });
  };

  const clearFilters = () => {
    setLocalSearch('');
    onFilterChange({
      search: '',
      brand: '',
      category: '',
      maxPrice: ''
    });
  };

  const hasActiveFilters = filters.search || filters.brand || filters.category || filters.maxPrice;

  const priceRanges = [
    { value: '500', label: 'Under ₹500', icon: FaTag },
    { value: '1000', label: 'Under ₹1,000', icon: FaRupeeSign },
    { value: '5000', label: 'Under ₹5,000', icon: FaStar },
    { value: '10000', label: 'Under ₹10,000', icon: FaBolt },
  ];

  const popularCategories = categories.slice(0, 6);
  const popularBrands = brands.slice(0, 6);

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <FaFilter className="text-white text-lg" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Filters</h3>
            <p className="text-sm text-gray-600">Refine your search</p>
          </div>
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <HiRefresh size={14} />
            Reset
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
          <FaSearch className="text-blue-500" size={14} />
          Search Products
        </label>
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search products, brands, features..."
            value={localSearch}
            onChange={handleSearchChange}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 bg-gray-50/50"
          />
          {localSearch && (
            <button
              onClick={() => setLocalSearch('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <FaTimes size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Quick Categories */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
          <HiSparkles className="text-yellow-500" size={16} />
          Popular Categories
        </label>
        <div className="flex flex-wrap gap-2">
          {loading ? (
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="w-20 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : (
            popularCategories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filters.category === category
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Categories Filter */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          All Categories
        </label>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-8 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : (
            categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                  filters.category === category
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${
                  filters.category === category ? 'bg-blue-500' : 'bg-gray-300'
                }`} />
                {category}
                {filters.category === category && (
                  <FaTimes className="ml-auto text-blue-500" size={12} />
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Brands Filter */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Popular Brands
        </label>
        <div className="space-y-2">
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-8 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : (
            popularBrands.map((brand) => (
              <button
                key={brand}
                onClick={() => handleBrandChange(brand)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                  filters.brand === brand
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${
                  filters.brand === brand ? 'bg-green-500' : 'bg-gray-300'
                }`} />
                {brand}
                {filters.brand === brand && (
                  <FaTimes className="ml-auto text-green-500" size={12} />
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Price Range
        </label>
        <div className="grid grid-cols-2 gap-3">
          {priceRanges.map((range) => {
            const IconComponent = range.icon;
            return (
              <button
                key={range.value}
                onClick={() => handlePriceRangeChange(range.value)}
                className={`flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  filters.maxPrice === range.value
                    ? 'bg-orange-50 text-orange-700 border border-orange-200'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <IconComponent 
                  size={12} 
                  className={filters.maxPrice === range.value ? 'text-orange-500' : 'text-gray-400'} 
                />
                {range.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Price Range Slider */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Custom Price Range
        </label>
        <div className="space-y-3">
          <input
            type="range"
            min="0"
            max="20000"
            step="500"
            value={filters.maxPrice || 0}
            onChange={(e) => handlePriceRangeChange(e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>₹0</span>
            <span className="font-semibold text-blue-600">
              {filters.maxPrice ? `Up to ₹${filters.maxPrice}` : 'Any Price'}
            </span>
            <span>₹20,000</span>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700">Active Filters</span>
            <span className="text-xs text-gray-500">{Object.values(filters).filter(Boolean).length} applied</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                Search: "{filters.search}"
                <button
                  onClick={() => setLocalSearch('')}
                  className="ml-2 hover:text-blue-600"
                >
                  ×
                </button>
              </span>
            )}
            {filters.brand && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                Brand: {filters.brand}
                <button
                  onClick={() => handleBrandChange(filters.brand)}
                  className="ml-2 hover:text-green-600"
                >
                  ×
                </button>
              </span>
            )}
            {filters.category && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                Category: {filters.category}
                <button
                  onClick={() => handleCategoryChange(filters.category)}
                  className="ml-2 hover:text-purple-600"
                >
                  ×
                </button>
              </span>
            )}
            {filters.maxPrice && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                Max: ₹{filters.maxPrice}
                <button
                  onClick={() => handlePriceRangeChange(filters.maxPrice)}
                  className="ml-2 hover:text-orange-600"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Custom CSS for range slider */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(59, 130, 246, 0.4);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(59, 130, 246, 0.4);
        }
      `}</style>
    </div>
  );
}