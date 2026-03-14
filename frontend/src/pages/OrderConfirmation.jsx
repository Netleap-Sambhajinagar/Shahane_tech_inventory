import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Package, Truck, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const OrderConfirmation = () => {
  const { clearCart } = useCart();
  
  // Get real order data
  const getOrderData = () => {
    const orderDate = new Date();
    const estimatedDelivery = new Date(orderDate);
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 4); // 4 days delivery
    
    // Generate tracking number based on timestamp
    const timestamp = orderDate.getTime().toString().slice(-6);
    const trackingNumber = `00${timestamp}NB21`;
    
    return {
      orderId: `ORD-${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}-${String(orderDate.getDate()).padStart(2, '0')}-${timestamp}`,
      orderDate: orderDate.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      estimatedDelivery: estimatedDelivery.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      trackingNumber: trackingNumber,
      shippingMethod: 'Standard Delivery',
      shippingAddress: {
        name: 'John Doe',
        street: '123 Main Street, Apt 4B',
        city: 'Mumbai, Maharashtra 400001',
        phone: '+91 98765 43210'
      },
      items: [
        {
          id: 1,
          name: 'Hinged BOX 250 ML',
          quantity: 2,
          price: 22,
          image: '/product-box.jpg'
        }
      ],
      subtotal: 44,
      deliveryCharge: 0,
      discount: 0,
      tax: 100,
      total: 144
    };
  };
  
  const orderData = getOrderData();

  React.useEffect(() => {
    // Clear cart after order confirmation
    clearCart();
    // Set hasOrders flag to true
    localStorage.setItem('hasOrders', 'true');
    // Save the real order date and time
    localStorage.setItem('orderDate', new Date().toISOString());
  }, [clearCart]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Thank You!</h1>
        <p className="text-slate-600">Your order has been placed successfully</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Info */}
          <div className="bg-white rounded-xl border border-slate-100 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Order Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500 mb-1">Order ID</p>
                <p className="font-semibold text-slate-900">{orderData.orderId}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Order Date</p>
                <p className="font-semibold text-slate-900">{orderData.orderDate}</p>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-white rounded-xl border border-slate-100 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Shipping Information</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900">{orderData.shippingAddress.name}</p>
                  <p className="text-sm text-slate-600">{orderData.shippingAddress.street}</p>
                  <p className="text-sm text-slate-600">{orderData.shippingAddress.city}</p>
                  <p className="text-sm text-slate-600">{orderData.shippingAddress.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900">{orderData.shippingMethod}</p>
                  <p className="text-sm text-slate-600">Estimated arrival: {orderData.estimatedDelivery}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl border border-slate-100 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {orderData.items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-50 shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{item.name}</h3>
                    <p className="text-sm text-slate-500">Quantity: {item.quantity}</p>
                    <p className="text-sm font-bold text-blue-600 mt-1">₹{item.price}/piece</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-100 p-6 sticky top-8">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Order Summary</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-medium text-slate-900">₹{orderData.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Delivery Charge</span>
                <span className="font-medium text-green-600">FREE</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Discount</span>
                <span className="font-medium text-red-600">-₹{orderData.discount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Estimate Tax</span>
                <span className="font-medium text-slate-900">₹{orderData.tax}</span>
              </div>
              <div className="border-t border-slate-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-slate-900">Total</span>
                  <span className="text-2xl font-bold text-blue-600">₹{orderData.total}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Link 
                to="/"
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-center block flex items-center justify-center gap-2"
              >
                Done
                <ArrowRight size={18} />
              </Link>
              <Link 
                to="/account"
                className="w-full py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors text-center block"
              >
                View Order History
              </Link>
            </div>

            {/* Help Section */}
            <div className="mt-6 p-4 bg-slate-50 rounded-lg">
              <h3 className="font-semibold text-slate-900 mb-2">Need Help?</h3>
              <p className="text-sm text-slate-600 mb-3">
                If you have any questions about your order, please contact our customer support.
              </p>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Email:</span> support@shahanetech.com
                </p>
                <p className="text-sm">
                  <span className="font-medium">Phone:</span> +91 98765 43210
                </p>
                <p className="text-sm">
                  <span className="font-medium">Hours:</span> Mon-Sat, 9AM-6PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
