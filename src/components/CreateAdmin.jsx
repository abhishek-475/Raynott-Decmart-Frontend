import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAdminUser } from '../api/authService';
import toast from 'react-hot-toast';
import { 
  FaUserShield, 
  FaArrowLeft, 
  FaEnvelope, 
  FaUser, 
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCheckCircle
} from 'react-icons/fa';
import { HiShieldCheck, HiSparkles } from 'react-icons/hi';

export default function CreateAdmin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and numbers';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    setLoading(true);
    try {
      await createAdminUser({
        name: formData.name.trim(),
        email: formData.email.toLowerCase(),
        password: formData.password
      });

      toast.success('Admin user created successfully!');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      
      // Navigate back to admin dashboard after a short delay
      setTimeout(() => {
        navigate('/admin');
      }, 1500);

    } catch (error) {
      console.error('Create admin error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create admin user';
      toast.error(errorMessage);
      
      // Set specific field errors if available
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = {
    score: formData.password ? Math.min(
      (formData.password.length >= 6 ? 1 : 0) +
      (/[a-z]/.test(formData.password) ? 1 : 0) +
      (/[A-Z]/.test(formData.password) ? 1 : 0) +
      (/\d/.test(formData.password) ? 1 : 0) +
      (/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 1 : 0),
      5
    ) : 0,
    label: ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'],
    color: ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500', 'bg-emerald-500']
  };

  const requirements = [
    { label: 'At least 6 characters', met: formData.password.length >= 6 },
    { label: 'Contains lowercase letter', met: /[a-z]/.test(formData.password) },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(formData.password) },
    { label: 'Contains number', met: /\d/.test(formData.password) },
    { label: 'Contains special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password) }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors p-2 hover:bg-white rounded-xl"
          >
            <FaArrowLeft size={16} />
            Back to Dashboard
          </button>
          <div className="w-1 h-8 bg-gray-300"></div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
              Create Admin User
            </h1>
            <p className="text-gray-600 mt-1">Add a new administrator to the system</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
              
              {/* Form Header */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <FaUserShield className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Admin Registration</h2>
                  <p className="text-gray-600">Create a new administrator account</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Name Field */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FaUser className="text-blue-500" size={14} />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    className={`w-full border rounded-xl p-4 transition-all duration-200 placeholder-gray-400 focus:ring-3 ${
                      errors.name 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <HiShieldCheck size={14} />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FaEnvelope className="text-blue-500" size={14} />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    className={`w-full border rounded-xl p-4 transition-all duration-200 placeholder-gray-400 focus:ring-3 ${
                      errors.email 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <HiShieldCheck size={14} />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FaLock className="text-blue-500" size={14} />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Create a strong password"
                      className={`w-full border rounded-xl p-4 pr-12 transition-all duration-200 placeholder-gray-400 focus:ring-3 ${
                        errors.password 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                    </button>
                  </div>
                  
                  {/* Password Strength */}
                  {formData.password && (
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Password Strength:</span>
                        <span className={`font-semibold ${
                          passwordStrength.score >= 4 ? 'text-green-600' :
                          passwordStrength.score >= 3 ? 'text-blue-600' :
                          passwordStrength.score >= 2 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {passwordStrength.label[passwordStrength.score]}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            passwordStrength.color[passwordStrength.score]
                          }`}
                          style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {errors.password && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <HiShieldCheck size={14} />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FaLock className="text-blue-500" size={14} />
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className={`w-full border rounded-xl p-4 transition-all duration-200 placeholder-gray-400 focus:ring-3 ${
                      errors.confirmPassword 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                    }`}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <HiShieldCheck size={14} />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Creating Admin...
                    </>
                  ) : (
                    <>
                      <FaUserShield size={16} />
                      Create Admin User
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar - Requirements & Info */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              
              {/* Password Requirements */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <HiShieldCheck className="text-blue-500" />
                  Password Requirements
                </h3>
                <div className="space-y-3">
                  {requirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        req.met 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        <FaCheckCircle size={12} />
                      </div>
                      <span className={`text-sm ${
                        req.met ? 'text-green-700' : 'text-gray-600'
                      }`}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Admin Privileges */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <HiSparkles className="text-blue-600" />
                  Admin Privileges
                </h3>
                <ul className="space-y-2 text-blue-800 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    Full access to admin dashboard
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    Manage products and inventory
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    Process and manage orders
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    User management capabilities
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    Access to analytics and reports
                  </li>
                </ul>
              </div>

              {/* Security Note */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-yellow-900 mb-2">⚠️ Security Note</h3>
                <p className="text-yellow-800 text-sm">
                  Admin users have full access to the system. Only create admin accounts for trusted personnel and ensure strong passwords are used.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}