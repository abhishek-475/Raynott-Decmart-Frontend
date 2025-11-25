import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { loadCart } from "../utils/cart";
import { 
  HiMenu, 
  HiX, 
  HiShoppingCart, 
  HiUser, 
  HiLogout,
  HiHome,
  HiShoppingBag
} from "react-icons/hi";
import { 
  FaUserShield, 
  FaGem, 
  FaCrown
} from "react-icons/fa";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const cartCount = loadCart().reduce((sum, i) => sum + i.qty, 0);
  const [open, setOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setOpen(false);
    setShowUserMenu(false);
  };

  const navLinks = [
    { path: "/", label: "Home", icon: HiHome },
    { path: "/products", label: "Products", icon: HiShoppingBag },
  ];

  return (
    <nav className="sticky top-0 bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-100 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            onClick={() => setOpen(false)}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <FaGem className="text-white text-lg" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                Raynott
              </span>
              <span className="text-xs font-medium text-gray-500 -mt-1">Decmart</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              const isActive = isActiveRoute(link.path);
              
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 border border-blue-200"
                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  <IconComponent size={18} />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop Right Menu */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 group"
            >
              <div className="relative">
                <HiShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                Cart
              </div>
            </Link>

            {/* User Menu or Login Button */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-50 transition-colors duration-200 border border-transparent hover:border-gray-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user?.name?.charAt(0).toUpperCase() || <HiUser size={16} />}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium text-gray-900">
                      {user?.name || 'Guest'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {user?.isAdmin ? 'Administrator' : 'Customer'}
                    </span>
                  </div>
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-20">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {user?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {user?.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {user?.email}
                            </p>
                          </div>
                          {user?.isAdmin && (
                            <FaCrown className="text-yellow-500 flex-shrink-0" />
                          )}
                        </div>
                      </div>

                      {/* Admin Links */}
                      {user?.isAdmin && (
                        <div className="border-b border-gray-100 pb-2">
                          <Link
                            to="/admin"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          >
                            <FaUserShield className="text-blue-500" />
                            Admin Dashboard
                          </Link>
                        </div>
                      )}

                      {/* User Links */}
                      <div className="border-b border-gray-100 pb-2">
                        <Link
                          to="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <HiUser size={16} />
                          My Profile
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <HiShoppingBag size={16} />
                          My Orders
                        </Link>
                      </div>

                      {/* Logout */}
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <HiLogout size={16} />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              // Show Login/Register buttons when no user is logged in
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 rounded-lg hover:bg-gray-50"
            onClick={() => setOpen(!open)}
          >
            {open ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-inner">
          <div className="container mx-auto px-4 py-4 space-y-2">
            
            {/* Navigation Links */}
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              const isActive = isActiveRoute(link.path);
              
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 border border-blue-200"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <IconComponent size={20} />
                  {link.label}
                </Link>
              );
            })}

            {/* Cart */}
            <Link
              to="/cart"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <div className="relative">
                <HiShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              Cart ({cartCount})
            </Link>

            {/* User Section */}
            {user ? (
              <>
                {/* Admin Dashboard */}
                {user?.isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <FaUserShield />
                    Admin Dashboard
                  </Link>
                )}

                <div className="px-4 py-3 border-t border-gray-100 mt-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {user.isAdmin ? 'Administrator' : 'Customer'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* User Links */}
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <HiUser size={20} />
                  My Profile
                </Link>

                <Link
                  to="/orders"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <HiShoppingBag size={20} />
                  My Orders
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left"
                >
                  <HiLogout size={20} />
                  Sign Out
                </button>
              </>
            ) : (
              // Show Login/Register in mobile menu when no user
              <div className="space-y-2 border-t border-gray-100 pt-4 mt-2">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <HiUser size={20} />
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                >
                  <HiUser size={20} />
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;