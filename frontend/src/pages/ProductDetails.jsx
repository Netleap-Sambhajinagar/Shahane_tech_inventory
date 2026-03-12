import React, { useState } from 'react';
import { Star, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

const ProductDetails = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1000);

  // Partial product object for cart (in a real app, this would come from a fetch)
  const product = {
      id: 'P250ML', // Mock ID for demo
      name: 'Hinged box',
      size: '250 ML',
      price: 2.8,
      image: BOX_IMAGE
  };

  const handleAddToCart = () => {
      addToCart({ ...product, quantity });
  };

  const relatedProducts = [
    { id: 5, name: 'Hinged Box', size: '375 ml', price: '4', oldPrice: '4', minOrder: 1000, deliveryDate: 'thu,29 jan', image: BOX_IMAGE },
    { id: 6, name: 'Hinged Box', size: '375 ml', price: '3', oldPrice: '4', minOrder: 1000, deliveryDate: 'thu,29 jan', image: BOX_IMAGE },
    { id: 7, name: 'Hinged Box', size: '375 ml', price: '3', oldPrice: '4', minOrder: 1000, deliveryDate: 'thu,29 jan', image: BOX_IMAGE },
  ];

  const reviews = [
    { name: 'Alex Mathio', rating: 4.3, text: 'The 250 ml hinged boxes are very practical and useful for everyday food packaging. Their compact size makes them perfect for storing small portions like snacks, sweets, dry fruits, desserts, or sauces.' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-8 py-10">
      <p className="text-slate-900 font-bold mb-8 text-xl">Home &gt; 250 ML</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        {/* Left: Gallery */}
        <div className="space-y-4">
          <div className="aspect-[4/3] rounded-2xl border border-slate-100 overflow-hidden bg-slate-50">
            <img src={BOX_IMAGE} alt="Hinged box" className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-3 gap-4">
             {/* Using the same thumbnails image for all slots for demo */}
            <div className="aspect-square rounded-xl border border-slate-200 overflow-hidden cursor-pointer hover:border-blue-500 transition-colors">
              <img src={THUMBNAILS} alt="Thumbnail 1" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-square rounded-xl border border-slate-200 overflow-hidden cursor-pointer hover:border-blue-500 transition-colors">
              <img src={THUMBNAILS} alt="Thumbnail 2" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-square rounded-xl border border-slate-200 overflow-hidden cursor-pointer hover:border-blue-500 transition-colors">
              <img src={THUMBNAILS} alt="Thumbnail 3" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Hinged box 250 ML</h1>
          
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl font-bold text-slate-900">4.3</span>
            <div className="flex text-yellow-400">
              {Array(5).fill(0).map((_, i) => (
                <Star key={i} size={20} fill={i < 4 ? "currentColor" : "none"} strokeWidth={1.5} />
              ))}
            </div>
            <span className="text-slate-400 font-medium">(14)</span>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl text-slate-300 line-through font-medium">₹3</span>
            <span className="text-4xl font-bold text-slate-900">₹2.8/piece</span>
          </div>
          
          <p className="text-slate-500 font-bold mb-6 italic text-sm">Min order quantity= 1000</p>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center border border-blue-600 rounded-lg overflow-hidden bg-blue-50">
              <button onClick={() => setQuantity(q => Math.max(0, q - 100))} className="p-2 text-blue-600 hover:bg-blue-100 transition-colors">
                <Minus size={20} strokeWidth={3} />
              </button>
              <input 
                type="number" 
                value={quantity} 
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                className="w-20 text-center font-bold text-slate-900 bg-transparent border-none focus:ring-0"
              />
              <button onClick={() => setQuantity(q => q + 100)} className="p-2 text-blue-600 hover:bg-blue-100 transition-colors">
                <Plus size={20} strokeWidth={3} />
              </button>
            </div>
          </div>

          <div className="text-slate-500 text-sm leading-relaxed mb-8 space-y-4">
            <p>Designed for convenience and durability, the 250 ml hinged boxes provide a reliable packaging solution for small food portions and takeaway items. These containers are ideal for storing snacks, sweets, dry fruits, desserts, or sauces, making them perfect for bakeries, cafes, and home use.</p>
            <p>Made from high-quality, food-grade plastic, these hinged boxes help maintain hygiene and freshness during storage and transport.</p>
          </div>

          <div className="mb-8">
            <p className="text-blue-600 font-bold uppercase tracking-tight mb-4">FREE delivery thu,29</p>
            <button 
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-3 w-full py-4 bg-blue-600 text-white rounded-xl text-lg font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-[0.98]"
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold text-slate-900 mb-8 border-b-2 border-slate-100 pb-4 inline-block pr-12">Rating & Reviews</h2>
        <div className="flex items-start gap-12">
          <div className="flex flex-col">
            <div className="flex items-center gap-4 mb-2">
              <span className="text-6xl font-bold text-slate-900">4.3</span>
              <div className="flex text-yellow-400 gap-1">
                {Array(5).fill(0).map((_, i) => (
                  <Star key={i} size={28} fill="currentColor" />
                ))}
              </div>
            </div>
            <p className="text-slate-400 font-medium">(14 New Reviews)</p>
          </div>

          <div className="flex-1 max-w-2xl bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-bold text-slate-900 text-lg">Alex Mathio</span>
              <span className="font-bold text-slate-900">4.3</span>
              <Star size={20} fill="#facc15" stroke="none" />
            </div>
            <p className="text-slate-500 leading-relaxed italic">{reviews[0].text}</p>
          </div>
        </div>
      </section>

      {/* Suggested */}
      <section>
        <h2 className="text-3xl font-bold text-slate-900 mb-10">You might also like</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {relatedProducts.map(p => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
