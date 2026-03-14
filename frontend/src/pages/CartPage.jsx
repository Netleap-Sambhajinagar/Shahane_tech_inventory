import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import BOX_IMAGE from '../assets/product_box.png';

const CartPage = () => {
  const { cartItems, removeFromCart, addToCart } = useCart();

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryCharge = 0; // Free delivery
  const estimateTax = 100; // Fixed tax for now
  const total = subtotal + deliveryCharge + estimateTax;

  // Sample recommended products
  const recommendedProducts = [
    { id: 101, name: 'Round BOX 300 ML', price: 25, image: BOX_IMAGE },
    { id: 102, name: 'Square BOX 200 ML', price: 20, image: BOX_IMAGE },
    { id: 103, name: 'Rectangle BOX 400 ML', price: 30, image: BOX_IMAGE },
    { id: 104, name: 'Oval BOX 350 ML', price: 28, image: BOX_IMAGE },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-100">
          <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Your cart is empty</h2>
          <p className="text-slate-500 mb-6">Looks like you haven't added anything to your cart yet</p>
          <Link 
            to="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="bg-white rounded-xl border border-slate-100 p-6">
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-50 shrink-0">
                      <img 
                        src={item.image || BOX_IMAGE} 
                        alt={item.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">{item.name}</h3>
                          <p className="text-sm text-slate-500 mt-1">Min order quantity: {item.minOrderQuantity || 1}</p>
                          <p className="text-xl font-bold text-blue-600 mt-2">₹{item.price}/piece</p>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)} 
                          className="text-slate-400 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-slate-600">Quantity:</span>
                          <div className="flex items-center border border-slate-300 rounded-lg">
                            <button 
                              onClick={() => addToCart({...item, quantity: -100})}
                              className="px-3 py-2 text-slate-600 hover:bg-slate-100 transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={16} strokeWidth={3} />
                            </button>
                            <span className="px-4 font-bold text-slate-900 min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => addToCart({...item, quantity: 100})}
                              className="px-3 py-2 text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                              <Plus size={16} strokeWidth={3} />
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-500">Total:</p>
                          <p className="text-xl font-bold text-slate-900">₹{item.price * item.quantity}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8 pt-6 border-t border-slate-100">
                <Link 
                  to="/"
                  className="flex-1 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors text-center"
                >
                  Back to Shopping
                </Link>
                <Link 
                  to="/checkout"
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
                >
                  Proceed to Place
                </Link>
              </div>
            </div>

            {/* You Might Also Like Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">You Might Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendedProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square bg-slate-50 overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-slate-900 text-sm mb-2">{product.name}</h3>
                      <p className="text-lg font-bold text-blue-600 mb-3">₹{product.price}</p>
                      <button className="w-full py-2 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-white rounded-xl border border-slate-100 p-6 sticky top-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal ({cartItems.length} items)</span>
                  <span className="font-medium text-slate-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Delivery Charge</span>
                  <span className="font-medium text-green-600">FREE</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Estimate Tax</span>
                  <span className="font-medium text-slate-900">₹{estimateTax}</span>
                </div>
                <div className="border-t border-slate-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-slate-900">Total</span>
                    <span className="text-2xl font-bold text-blue-600">₹{total}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Link 
                  to="/checkout"
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-center block"
                >
                  Proceed to Place
                </Link>
                <Link 
                  to="/"
                  className="w-full py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors text-center block"
                >
                  Back to Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
