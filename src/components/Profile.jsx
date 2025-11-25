import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getProfile, updateProfile } from '../api/authService';
import toast from 'react-hot-toast';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaEdit, 
  FaSave,
  FaTimes,
  FaCalendarAlt,
  FaShoppingBag,
  FaLock
} from 'react-icons/fa';
import { HiUser, HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';

export default function Profile() {
  const { user, updateUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getProfile();
      setProfile(data);
      setFormData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || ''
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    if (!formData.email.trim()) {
      toast.error('Email is required');
      return;
    }

    setSaving(true);
    try {
      const updatedData = await updateProfile(formData);
      setProfile(updatedData);
      updateUser(updatedData);
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profile?.name || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      address: profile?.address || ''
    });
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-1">Manage your personal information</p>
          </div>
          
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaEdit size={16} />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaTimes size={16} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <FaSave size={16} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              
              {/* Profile Header */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                  {profile?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{profile?.name}</h2>
                  <p className="text-gray-600">{profile?.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      profile?.isAdmin 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {profile?.isAdmin ? 'Administrator' : 'Customer'}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <FaCalendarAlt size={10} />
                      Joined {new Date(profile?.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Profile Form */}
              <form onSubmit={handleSave} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <HiUser className="text-blue-500" />
                    Full Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">{profile?.name}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <HiMail className="text-blue-500" />
                    Email Address
                  </label>
                  {editing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                      placeholder="Enter your email address"
                    />
                  ) : (
                    <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">{profile?.email}</p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <HiPhone className="text-blue-500" />
                    Phone Number
                  </label>
                  {editing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">
                      {profile?.phone || 'Not provided'}
                    </p>
                  )}
                </div>

                {/* Address Field */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <HiLocationMarker className="text-blue-500" />
                    Address
                  </label>
                  {editing ? (
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all resize-none"
                      placeholder="Enter your address"
                    />
                  ) : (
                    <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">
                      {profile?.address || 'Not provided'}
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Account Overview</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Member since</span>
                  <span className="font-semibold">
                    {new Date(profile?.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Account type</span>
                  <span className={`font-semibold ${
                    profile?.isAdmin ? 'text-purple-600' : 'text-blue-600'
                  }`}>
                    {profile?.isAdmin ? 'Administrator' : 'Customer'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Email verified</span>
                  <span className="font-semibold text-green-600">Yes</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => window.location.href = '/orders'}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left"
                >
                  <FaShoppingBag className="text-blue-500" />
                  <div>
                    <div className="font-medium">Order History</div>
                    <div className="text-sm text-gray-500">View your past orders</div>
                  </div>
                </button>
                
                <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left">
                  <FaLock className="text-green-500" />
                  <div>
                    <div className="font-medium">Security</div>
                    <div className="text-sm text-gray-500">Change password</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Security Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <h4 className="font-semibold text-blue-900 text-sm mb-2">🔒 Security</h4>
              <p className="text-blue-800 text-xs">
                Your personal information is secure and encrypted. We never share your data with third parties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}