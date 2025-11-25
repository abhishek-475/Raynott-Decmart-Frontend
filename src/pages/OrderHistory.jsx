import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../api/orderService';
import { formatCurrency } from '../utils/format';
import toast from "react-hot-toast";
import { 
  FaShoppingBag, 
  FaCalendarAlt, 
  FaRupeeSign, 
  FaBox, 
  FaShippingFast, 
  FaCheckCircle, 
  FaClock,
  FaTimesCircle,
  FaEye,
  FaArrowLeft,
  FaSync
} from 'react-icons/fa';
import { HiSparkles, HiReceiptRefund } from 'react-icons/hi';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    try {
      const data = await getMyOrders();
      setOrders(data.orders || data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch orders");
    }
  };

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      await fetchOrders();
      setLoading(false);
    };
    loadOrders();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
    toast.success('Orders updated');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing':
        return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: FaClock };
      case 'Shipped':
        return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: FaShippingFast };
      case 'Delivered':
        return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: FaCheckCircle };
      case 'Cancelled':
        return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: FaTimesCircle };
      default:
        return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', icon: FaBox };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOrderItemsCount = (order) => {
    return order.orderItems?.reduce((total, item) => total + item.qty, 0) || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-2xl mb-4"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors p-2 hover:bg-white rounded-xl"
            >
              <FaArrowLeft size={16} />
              Back to Shop
            </Link>
            <div className="w-1 h-8 bg-gray-300"></div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                My Orders
              </h1>
              <p className="text-gray-600 mt-1">Track and manage your orders</p>
            </div>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <FaSync className={refreshing ? 'animate-spin' : ''} size={14} />
            Refresh
          </button>
        </div>

        {/* Orders Count */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <FaShoppingBag className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
                <p className="text-gray-600">
                  {orders.length} order{orders.length !== 1 ? 's' : ''} placed
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{orders.length}</div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FaShoppingBag className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Orders Yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You haven't placed any orders yet. Start shopping to discover amazing products!
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <HiSparkles size={16} />
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusConfig = getStatusColor(order.orderStatus);
              const StatusIcon = statusConfig.icon;
              const itemsCount = getOrderItemsCount(order);

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                            <FaShoppingBag className="text-blue-600 text-lg" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Order #{order._id.slice(-8).toUpperCase()}
                          </h3>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <FaCalendarAlt size={12} />
                              {formatDate(order.createdAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaBox size={12} />
                              {itemsCount} item{itemsCount !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">
                            {formatCurrency(order.totalPrice)}
                          </div>
                          <div className="text-sm text-gray-600">Total Amount</div>
                        </div>
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                          <StatusIcon size={14} />
                          {order.orderStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Items Preview */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Items</h4>
                        <div className="space-y-3">
                          {order.orderItems?.slice(0, 3).map((item, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <img
                                src={item.image || "https://via.placeholder.com/60x60/ffffff/cccccc?text=Product"}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded-lg bg-gray-100"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {item.name}
                                </p>
                                <p className="text-xs text-gray-600">
                                  Qty: {item.qty} × {formatCurrency(item.price)}
                                </p>
                              </div>
                            </div>
                          ))}
                          {order.orderItems?.length > 3 && (
                            <p className="text-sm text-gray-600">
                              +{order.orderItems.length - 3} more items
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Shipping Info */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Shipping Details</h4>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p className="font-medium text-gray-900">
                            {order.shippingInfo?.address}
                          </p>
                          <p>
                            {order.shippingInfo?.city}, {order.shippingInfo?.state} - {order.shippingInfo?.pincode}
                          </p>
                          <p>Phone: {order.shippingInfo?.phone}</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-100">
                      <Link
                        to={`/orders/${order._id}`}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        <FaEye size={14} />
                        View Details
                      </Link>
                      {order.orderStatus === 'Delivered' && (
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                          <HiReceiptRefund size={16} />
                          Return/Exchange
                        </button>
                      )}
                      {order.orderStatus === 'Processing' && (
                        <button className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors font-medium">
                          <FaTimesCircle size={14} />
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Stats */}
        {orders.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {orders.filter(o => o.orderStatus === 'Processing').length}
              </div>
              <div className="text-sm text-gray-600">Processing</div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {orders.filter(o => o.orderStatus === 'Shipped').length}
              </div>
              <div className="text-sm text-gray-600">Shipped</div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {orders.filter(o => o.orderStatus === 'Delivered').length}
              </div>
              <div className="text-sm text-gray-600">Delivered</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}