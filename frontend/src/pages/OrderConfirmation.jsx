import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Check, Package, Truck, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const OrderConfirmation = () => {
  const { clearCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    // Try to get order data from location state first
    if (location.state?.orderData) {
      setOrderData(location.state.orderData);
    } else {
      // Fallback: create mock order data for testing
      const mockOrderData = {
        order_id: 'ORD-' + Date.now(),
        order_date: new Date().toLocaleDateString(),
        status: 'ordered',
        prize: 500,
        city: 'Mumbai',
        state: 'Maharashtra',
        items: [
          {
            name: 'Hinged Box',
            quantity: 2,
            price: 250
          }
        ]
      };
      setOrderData(mockOrderData);
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
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-slate-500 mb-4 text-sm sm:text-base">Order information not found</p>
          <Link 
            to="/"
            className="text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="text-center mb-6 sm:mb-8">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Thank You!</h1>
        <p className="text-slate-600 text-sm sm:text-base">Your order has been placed successfully</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-slate-100">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 truncate">Order #{orderData.order_id || 'ORD-' + Date.now()}</h2>
            <p className="text-xs sm:text-sm text-slate-500">Placed on {orderData.order_date || new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Order Items</h3>
          <div className="space-y-2 sm:space-y-3">
            {orderData.items?.map((item, index) => (
              <div key={index} className="flex items-center gap-3 sm:gap-4 p-3 bg-slate-50 rounded-lg">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-200 rounded flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-slate-900 text-sm sm:text-base truncate">{item.name}</h4>
                  <p className="text-xs sm:text-sm text-slate-600">Quantity: {item.quantity}</p>
                  <p className="text-xs sm:text-sm text-slate-900 font-semibold">₹{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">Delivery Information</h3>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400" />
                <span className="text-slate-600">Order Date: {orderData.order_date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400" />
                <span className="text-slate-600">Status: <span className="font-medium text-green-600">{orderData.status}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400" />
                <span className="text-slate-600">Delivery: {orderData.city}, {orderData.state}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">Order Summary</h3>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Subtotal:</span>
                <span className="font-medium text-slate-900">₹{orderData.prize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Tax (5%):</span>
                <span className="font-medium text-slate-900">₹{Math.round(orderData.prize * 0.05)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="text-base sm:text-lg font-semibold text-slate-900">Total:</span>
                <span className="text-base sm:text-lg font-bold text-blue-600">₹{Math.round(orderData.prize * 1.05)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-slate-200">
          <button 
            onClick={() => {
              console.log('Continue Shopping clicked');
              try {
                navigate('/');
                // Fallback if navigate doesn't work
                setTimeout(() => {
                  if (window.location.pathname !== '/') {
                    window.location.href = '/';
                  }
                }, 100);
              } catch (error) {
                console.error('Navigation error:', error);
                window.location.href = '/';
              }
            }}
            className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors text-center font-medium text-sm sm:text-base"
          >
            Continue Shopping
          </button>
          <button 
            onClick={() => {
              console.log('Track Order clicked');
              try {
                navigate('/order-tracking');
                // Fallback if navigate doesn't work
                setTimeout(() => {
                  if (window.location.pathname !== '/order-tracking') {
                    window.location.href = '/order-tracking';
                  }
                }, 100);
              } catch (error) {
                console.error('Navigation error:', error);
                window.location.href = '/order-tracking';
              }
            }}
            className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center font-medium text-sm sm:text-base flex items-center justify-center gap-2"
          >
            Track Order
            <ArrowRight size={14} sm:size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
