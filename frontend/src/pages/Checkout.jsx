import React, { useState } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BOX_IMAGE from '../assets/product_box.png';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const { cartItems, removeFromCart, addToCart, cartCount } = useCart();
  const [discountCode, setDiscountCode] = useState('');
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.05); // 5% tax
  const total = subtotal + tax;

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;

    try {
      // Create order data
      const orderData = {
        customer_id: `CUST${Date.now()}`, // Generate customer ID
        customer_type: 'Regular',
        city: 'Mumbai', // Default city
        state: 'Maharashtra', // Default state
        order_date: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
        prize: total,
        status: 'Pending',
        items: cartItems.map(item => ({
          product_id: item.product_id || item.id, // Use product_id if available, otherwise fall back to id
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }))
      };

      // Send order to backend
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const order = await response.json();
        console.log('Order placed successfully:', order);
        
        // Trigger notification check for admin panel
        if (typeof window.triggerNotificationCheck === 'function') {
          window.triggerNotificationCheck();
        }
        
        // Clear cart
        if (typeof window.clearCart === 'function') {
          window.clearCart();
        }
        
        // Navigate to confirmation with order details
        navigate('/order-confirmation', { 
          state: { 
            orderId: order.order_id,
            orderData: {
              ...orderData,
              order_id: order.order_id
            }
          } 
        });
      } else {
        const errorData = await response.json();
        alert('Failed to place order: ' + (errorData.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('An error occurred while placing your order. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Section: Shipping Address */}
        <div className="flex-1 bg-slate-50/50 rounded-2xl p-8 border border-slate-100">
          <nav className="text-xs font-bold mb-4 flex items-center gap-1 uppercase tracking-wider">
            <span className="text-slate-400">cart</span>
            <span className="text-slate-400">&gt;</span>
            <span className="text-blue-600">shipping</span>
            <span className="text-slate-400">&gt;</span>
            <span className="text-slate-400">place</span>
          </nav>
          
          <h2 className="text-2xl font-bold text-slate-900 mb-6">shipping address</h2>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-900">first name*</label>
                <input type="text" placeholder="John" className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 transition-colors" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-900">last name*</label>
                <input type="text" placeholder="Doe" className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-900">email*</label>
                <input type="email" placeholder="john@example.com" className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 transition-colors" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-900">phone number*</label>
                <input type="tel" placeholder="1234567890" className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-900">city*</label>
                <input type="text" className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 transition-colors" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-900">state*</label>
                <input type="text" className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 transition-colors" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-900">zip code*</label>
                <input type="text" className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 transition-colors" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-900">description*</label>
              <textarea placeholder="enter a detailed address....." rows={4} className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-blue-500 transition-colors resize-none placeholder:text-slate-300" />
            </div>
          </form>
        </div>

        {/* Right Section: Cart Summary */}
        <div className="w-full lg:w-[450px]">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold text-slate-900 mb-6 uppercase tracking-tight">YOUR CART ({cartCount})</h2>

            <div className="space-y-6 max-h-[400px] overflow-y-auto mb-8 pr-2">
              {cartItems.length === 0 ? (
                <p className="text-slate-400 py-4 text-center">Your cart is empty.</p>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 p-3 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors group">
                    <div className="w-20 h-20 aspect-square rounded-lg border border-slate-100 overflow-hidden bg-slate-50 shrink-0">
                      <img src={item.image || BOX_IMAGE} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-slate-900 leading-tight">{item.name}</h3>
                          <p className="text-sm font-medium text-slate-500">{item.size}</p>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-slate-300 rounded overflow-hidden">
                          <button 
                            onClick={() => addToCart({...item, quantity: -100})} 
                            className="px-2 py-0.5 text-slate-600 hover:bg-slate-200 disabled:opacity-30"
                            disabled={item.quantity <= 0}
                          >
                            <Minus size={12} strokeWidth={3} />
                          </button>
                          <span className="px-2 font-bold text-slate-900 text-xs">{item.quantity}</span>
                          <button 
                            onClick={() => addToCart({...item, quantity: 100})} 
                            className="px-2 py-0.5 text-slate-600 hover:bg-slate-200"
                          >
                            <Plus size={12} strokeWidth={3} />
                          </button>
                        </div>
                        <span className="font-bold text-slate-900">₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center gap-2 mb-6 border border-slate-300 rounded-md p-1 pl-4">
              <input 
                type="text" 
                placeholder="discount code" 
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-sm font-medium"
              />
              <button className="px-4 py-2 text-sm font-bold text-slate-900 hover:text-slate-600 uppercase tracking-wider">APPLY</button>
            </div>

            <div className="space-y-3 border-b border-slate-100 pb-4 mb-4 text-sm font-medium">
              <div className="flex justify-between text-slate-500">
                <span>sub total</span>
                <span className="text-slate-900 font-bold">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>delivery charge</span>
                <span className="text-green-600 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>estimate tax (5%)</span>
                <span className="text-slate-900 font-bold">₹{tax}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8">
              <span className="text-xl font-bold text-slate-900">total</span>
              <span className="text-2xl font-bold text-blue-600">₹{total}</span>
            </div>

            <button 
              disabled={cartItems.length === 0}
              onClick={handlePlaceOrder}
              className="w-full py-4 bg-blue-600 text-white rounded-xl text-lg font-bold hover:bg-blue-700 transition-all shadow-[0_4px_14px_0_rgba(37,99,235,0.3)] uppercase disabled:opacity-50 disabled:shadow-none"
            >
              place order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
