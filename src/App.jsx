import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import OrderHistory from './pages/OrderHistory';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ProductForm from './pages/Admin/ProductForm';
import CreateAdmin from './components/CreateAdmin';
import Profile from './components/Profile';

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        <Navbar />
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path='/products' element={<Products />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path='/profile' element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/product/new" element={<ProductForm />} />
            <Route path="/admin/create-admin" element={<CreateAdmin />} />
            <Route path="/admin/product/:id" element={<ProductForm />} />
            {/* admin routes */}
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}
