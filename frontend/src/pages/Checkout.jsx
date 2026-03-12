import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import BOX_IMAGE from '../assets/product_box.png';

const Checkout = () => {
  const [quantity, setQuantity] = useState(1000);

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
                <input 
                  type="text" 
                  defaultValue="juned"
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-900">last name*</label>
                <input 
                  type="text" 
                  defaultValue="khan"
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-900">email*</label>
                <input 
                  type="email" 
                  defaultValue="juned09may@gamil.com"
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-900">phone number*</label>
                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-2.5 focus-within:border-blue-500 transition-colors">
                  <span className="text-slate-400 font-bold border-r pr-2 whitespace-nowrap">IND &gt;</span>
                  <input 
                    type="tel" 
                    defaultValue="1234567890"
                    className="bg-transparent border-none outline-none w-full"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-900">city*</label>
                <input 
                  type="text" 
                  defaultValue="pune"
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-900">state*</label>
                <input 
                  type="text" 
                  defaultValue="maharashtra"
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-900">zip code*</label>
                <input 
                  type="text" 
                  defaultValue="431001"
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-900">description*</label>
              <textarea 
                placeholder="enter a enter a detailed address....."
                rows={6}
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-blue-500 transition-colors resize-none placeholder:text-slate-300"
              />
            </div>
          </form>
        </div>

        {/* Right Section: Cart Summary */}
        <div className="w-full lg:w-[400px]">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold text-slate-900 mb-6 uppercase tracking-tight">YOUR CART</h2>

            <div className="flex gap-4 mb-8">
              <div className="w-32 aspect-square rounded-xl border border-slate-100 overflow-hidden bg-slate-50 shrink-0">
                <img src={BOX_IMAGE} alt="Product" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 leading-tight">Hinged Box</h3>
                  <p className="text-xl font-bold text-slate-900">250 ml</p>
                </div>
                
                <div className="flex items-center border-2 border-slate-900 rounded-md overflow-hidden w-fit mt-2">
                  <button onClick={() => setQuantity(q => Math.max(0, q - 100))} className="p-1 px-2 border-r-2 border-slate-900 text-slate-900 hover:bg-slate-100 disabled:opacity-50" disabled={quantity <= 0}>
                    <Minus size={14} strokeWidth={4} className="text-blue-600" />
                  </button>
                  <span className="px-3 font-bold text-slate-900 text-sm">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 100)} className="p-1 px-2 border-l-2 border-slate-900 text-slate-900 hover:bg-slate-100">
                    <Plus size={14} strokeWidth={4} className="text-blue-600" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-8 border border-slate-300 rounded-md p-1 pl-4">
              <input 
                type="text" 
                placeholder="discount code" 
                className="flex-1 bg-transparent border-none outline-none text-sm font-medium"
              />
              <button className="px-4 py-2 text-sm font-bold text-slate-900 hover:text-slate-600 uppercase tracking-wider">APPLY</button>
            </div>

            <div className="space-y-1.5 border-b border-slate-400 pb-4 mb-4">
              <div className="flex justify-between text-slate-500 font-medium">
                <span>sub total</span>
                <span className="text-slate-900 font-bold">₹2800</span>
              </div>
              <div className="flex justify-between text-slate-500 font-medium">
                <span>delivery charge</span>
                <span className="text-slate-900 font-bold">00</span>
              </div>
              <div className="flex justify-between text-green-500/80 font-medium">
                <span>discount applied</span>
                <span className="font-bold">-₹100</span>
              </div>
              <div className="flex justify-between text-slate-500 font-medium">
                <span>estimate tax</span>
                <span className="text-slate-900 font-bold">₹100</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8">
              <span className="text-2xl font-bold text-slate-900">total</span>
              <span className="text-2xl font-bold text-slate-900">₹2800</span>
            </div>

            <button className="w-full py-4 bg-blue-600 text-white rounded-xl text-xl font-bold hover:bg-blue-700 transition-all shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] uppercase">
              place order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
