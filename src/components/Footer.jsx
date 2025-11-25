import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-gray-900 to-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">Raynott</div>
                <div className="text-sm text-gray-500 -mt-1">Decmart</div>
              </div>
            </Link>
            <p className="text-gray-600 mb-6 leading-relaxed max-w-xs">
              Bangalore's premier destination for curated products, exceptional quality, and reliable service.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200">
                <FaFacebookF className="text-gray-600 hover:text-gray-900" size={16} />
              </a>
              <a href="#" className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200">
                <FaTwitter className="text-gray-600 hover:text-gray-900" size={16} />
              </a>
              <a href="#" className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200">
                <FaInstagram className="text-gray-600 hover:text-gray-900" size={16} />
              </a>
              <a href="#" className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200">
                <FaLinkedinIn className="text-gray-600 hover:text-gray-900" size={16} />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-6 text-lg">Shop</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/products" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  Fashion
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  Home & Living
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  Sports
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-6 text-lg">Support</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  Shipping & Delivery
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  Returns & Refunds
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>

          {/* Bangalore Contact Info */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-6 text-lg">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-gray-400 mt-1 flex-shrink-0" size={16} />
                <div>
                  <p className="text-gray-900">
                    123 MG Road, Brigade Road<br />
                    Bangalore, Karnataka 560001<br />
                    India
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaPhone className="text-gray-400 mt-1 flex-shrink-0" size={16} />
                <div>
                  <a href="tel:+918088888888" className="text-gray-900 hover:text-blue-600 transition-colors duration-200">
                    +91 80888 88888
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaEnvelope className="text-gray-400 mt-1 flex-shrink-0" size={16} />
                <div>
                  <a href="mailto:support@raynott.com" className="text-gray-900 hover:text-blue-600 transition-colors duration-200">
                    support@raynott.com
                  </a>
                </div>
              </div>
              <div className="pt-2">
                <p className="text-sm text-gray-600">
                  <strong>Business Hours:</strong><br />
                  Mon - Sat: 9:00 AM - 8:00 PM<br />
                  Sunday: 10:00 AM - 6:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="border-t border-gray-200 pt-8 mb-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">Stay Updated</h3>
              <p className="text-gray-600">Get the latest deals and new arrivals</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 w-full lg:w-80"
              />
              <button className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-600 text-sm">
              © {new Date().getFullYear()} Raynott Decmart. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;