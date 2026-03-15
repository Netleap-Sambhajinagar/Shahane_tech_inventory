import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Check, Package, Truck, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const OrderConfirmation = () => {
  const { clearCart } = useCart();
  const location = useLocation();
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    if (location.state?.orderData) {
      setOrderData(location.state.orderData);
    }
  }, [location.state]);

  useEffect(() => {
    if (orderData) {
      clearCart();
      localStorage.setItem('hasOrders', 'true');
      localStorage.setItem('orderDate', new Date().toISOString());
    }
  }, [orderData, clearCart]);

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">Order information not found</p>
          <Link 
            to="/"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Thank You!</h1>
        <p className="text-slate-600">Your order has been placed successfully</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 mb-8">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Package className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Order #{orderData.order_id || 'ORD-' + Date.now()}</h2>
            <p className="text-sm text-slate-500">Placed on {orderData.order_date || new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Order Items</h3>
          <div className="space-y-3">
            {orderData.items?.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                <div className="w-12 h-12 bg-slate-200 rounded flex items-center justify-center">
                  <Package className="w-6 h-6 text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-slate-900">{item.name}</h4>
                  <p className="text-sm text-slate-600">Quantity: {item.quantity}</p>
                  <p className="text-sm text-slate-900 font-semibold">₹{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Delivery Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600">Order Date: {orderData.order_date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600">Status: <span className="font-medium text-green-600">{orderData.status}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600">Delivery: {orderData.city}, {orderData.state}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Subtotal:</span>
                <span className="font-medium text-slate-900">₹{orderData.prize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Tax (5%):</span>
                <span className="font-medium text-slate-900">₹{Math.round(orderData.prize * 0.05)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="text-lg font-semibold text-slate-900">Total:</span>
                <span className="text-lg font-bold text-blue-600">₹{Math.round(orderData.prize * 1.05)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-6 border-t border-slate-200">
          <Link 
            to="/"
            className="flex-1 px-6 py-3 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors text-center font-medium"
          >
            Continue Shopping
          </Link>
          <Link 
            to="/order-tracking"
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center font-medium flex items-center justify-center gap-2"
          >
            Track Order
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
