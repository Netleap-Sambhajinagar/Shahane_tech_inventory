import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, Package, Truck, Home, ShoppingBag, X, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getOrderStatusFromDB, getStatusColor, getStatusBgColor, formatOrderDate, generateTrackingNumber } from '../utils/orderTracking';
import BOX_IMAGE from '../assets/product_box.png';

const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      console.log('Fetching user orders...');
      
      // Use the new public customer endpoint
      const response = await fetch('http://localhost:5000/api/customer/orders');
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      console.log('Orders fetched:', data);
      
      // In a real app, you'd filter by customer ID. For now, we'll show all orders
      setOrders(data);
      if (data.length > 0) {
        setSelectedOrder(data[0]);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const recommendedProducts = [
    {
      id: 1,
      name: 'Hinged Box',
      size: '500ml',
      price: 25,
      image: BOX_IMAGE,
    },
    {
      id: 2,
      name: 'Round Box',
      size: '300ml',
      price: 20,
      image: BOX_IMAGE,
    },
    {
      id: 3,
      name: 'Square Box',
      size: '250ml',
      price: 18,
      image: BOX_IMAGE,
    },
    {
      id: 4,
      name: 'Rectangle Box',
      size: '400ml',
      price: 30,
      image: BOX_IMAGE,
    },
  ];

  const trackingSteps = [
    { key: 'ordered', label: 'Ordered', icon: Package },
    { key: 'dispatch', label: 'Dispatch', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: Home },
  ];

  const getCurrentStepIndex = (status) => {
    if (!status) return -1;
    const statusLower = status.toLowerCase();
    if (statusLower === 'cancelled') return -1;
    const steps = ['ordered', 'dispatch', 'delivered'];
    return steps.indexOf(statusLower);
  };

  const getEstimatedDelivery = (orderDate) => {
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + 4); // 4 days for delivery
    return deliveryDate;
  };

  const getOrderDetails = (order) => {
    const orderDate = formatOrderDate(order.order_date);
    const estimatedDelivery = getEstimatedDelivery(orderDate);
    
    // Get real product info from order items if available
    const firstItem = order.items && order.items.length > 0 ? order.items[0] : null;
    
    return {
      ...order,
      productName: firstItem?.product_name || 'Product', // Use real product name
      productSize: firstItem ? `${firstItem.quantity} units` : '1 unit', // Use real quantity
      quantity: firstItem?.quantity || 1, // Use real quantity
      estimatedArrival: estimatedDelivery.toLocaleDateString('en-US', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      }).toUpperCase(),
      trackingNumber: generateTrackingNumber(order.order_id, order.order_date),
      productImage: BOX_IMAGE,
      status: getOrderStatusFromDB(order.status),
      orderDate: orderDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      orderTime: orderDate.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      price: order.prize || 22,
      // Preserve cancellation data from backend
      cancellation_reason: order.cancellation_reason,
      cancellation_description: order.cancellation_description
    };
  };

  // Show loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="text-center py-16 bg-white rounded-xl border border-slate-100">
          <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Loading Orders...</h2>
          <p className="text-slate-500">Please wait while we fetch your order information.</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="text-center py-16 bg-white rounded-xl border border-slate-100">
          <div className="w-24 h-24 mx-auto mb-6 bg-red-50 rounded-full flex items-center justify-center">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Error Loading Orders</h2>
          <p className="text-slate-500 mb-6">{error}</p>
          <button 
            onClick={fetchUserOrders}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show No Orders message if no orders exist
  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="text-center py-16 bg-white rounded-xl border border-slate-100">
          <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">No Orders Yet</h2>
          <p className="text-slate-500 mb-6">You haven't placed any orders yet. Start shopping to see your orders here!</p>
          <Link 
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  const orderDetails = getOrderDetails(selectedOrder);
  const currentStepIndex = getCurrentStepIndex(orderDetails.status);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Order Tracking</h1>

      {/* Order Selection */}
      {orders.length > 1 && (
        <div className="bg-white rounded-xl border border-slate-100 p-4 mb-8">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Select Order
          </label>
          <select
            value={selectedOrder?.id}
            onChange={(e) => setSelectedOrder(orders.find(o => o.id === parseInt(e.target.value)))}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {orders.map(order => (
              <option key={order.id} value={order.id}>
                Order {order.order_id} - {order.status}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Cancellation Notice */}
      {orderDetails.status && orderDetails.status.toLowerCase() === 'cancelled' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <X className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-red-900 mb-2">Order Cancelled</h3>
              <p className="text-red-700 mb-2">
                This order has been cancelled due to: <span className="font-semibold">{orderDetails.cancellation_reason || 'No reason provided'}</span>
              </p>
              {orderDetails.cancellation_description && (
                <p className="text-red-600 text-sm mt-2">{orderDetails.cancellation_description}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Order Details Section */}
      <div className="bg-white rounded-xl border border-slate-100 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-32 h-32 rounded-lg overflow-hidden bg-slate-50 shrink-0">
            <img 
              src={orderDetails.productImage} 
              alt={orderDetails.productName} 
              className="w-full h-full object-contain" 
            />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-900 mb-2">{orderDetails.productName}</h2>
            <p className="text-slate-600 mb-4">{orderDetails.productSize}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-slate-500 mb-1">Quantity</p>
                <p className="font-semibold text-slate-900">{orderDetails.quantity}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Price</p>
                <p className="font-semibold text-slate-900">₹{orderDetails.price}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Total</p>
                <p className="font-semibold text-slate-900">₹{orderDetails.price * orderDetails.quantity}</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="mb-4">
              <p className="text-sm text-slate-500 mb-1">Estimated Arrival</p>
              <p className="font-bold text-lg text-blue-600">{orderDetails.estimatedArrival}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Tracking Number</p>
              <p className="font-bold text-slate-900">{orderDetails.trackingNumber}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tracking Progress Section */}
      {orderDetails.status !== 'cancelled' && (
        <div className="bg-white rounded-xl border border-slate-100 p-6 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Tracking Progress</h2>
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200"></div>
            <div 
              className="absolute top-5 left-0 h-0.5 bg-blue-600 transition-all duration-500"
              style={{ width: `${currentStepIndex >= 0 ? (currentStepIndex / (trackingSteps.length - 1)) * 100 : 0}%` }}
            ></div>
            
            {/* Tracking Steps */}
            <div className="relative flex justify-between">
              {trackingSteps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                
                return (
                  <div key={step.key} className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isCompleted ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle size={20} />
                      ) : (
                        <Circle size={20} />
                      )}
                    </div>
                    <p className={`mt-2 text-sm font-medium ${
                      isCompleted ? 'text-blue-600' : 'text-slate-400'
                    }`}>
                      {step.label}
                    </p>
                    {isCurrent && (
                      <p className="mt-1 text-xs text-slate-500 text-center max-w-[100px]">
                        {step.key === 'ordered' && `Order placed on ${orderDetails.orderDate} at ${orderDetails.orderTime}`}
                        {step.key === 'dispatch' && 'Shipped via Express Delivery'}
                        {step.key === 'delivered' && 'Delivered to your address'}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* You Might Also Like Section */}
      <div className="bg-white rounded-xl border border-slate-100 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-6">You Might Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-slate-50 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-contain" 
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-slate-900 text-sm mb-1">{product.name}</h3>
                <p className="text-xs text-slate-500 mb-2">{product.size}</p>
                <p className="text-lg font-bold text-blue-600 mb-3">₹{product.price}</p>
                <button className="w-full py-2 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors text-sm">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-8 text-center">
        <Link 
          to="/account"
          className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
        >
          Back to Orders
        </Link>
      </div>
    </div>
  );
};

export default OrderTracking;
