import React, { useState, useEffect } from 'react';
import { Star, Minus, Plus } from 'lucide-react';
import BOX_IMAGE from '../assets/product_box.png';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1000);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct({
            id: data.id,
            product_id: data.product_id, // Include product_id field
            name: data.name,
            size: data.size,
            price: data.purchase_price,
            oldPrice: data.old_price,
            minOrder: data.min_order,
            deliveryDate: data.delivery_date,
            image: data.image_url || BOX_IMAGE,
            description: data.description
        });
        if (data.min_order) setQuantity(data.min_order);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching product:', err);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
      if (product) {
        addToCart({ ...product, quantity });
      }
  };

  const relatedProducts = [
    { id: 5, name: 'Hinged Box', size: '375 ml', price: '4', oldPrice: '4', minOrder: 1000, deliveryDate: 'thu,29 jan', image: BOX_IMAGE },
    { id: 6, name: 'Hinged Box', size: '375 ml', price: '3', oldPrice: '4', minOrder: 1000, deliveryDate: 'thu,29 jan', image: BOX_IMAGE },
    { id: 7, name: 'Hinged Box', size: '375 ml', price: '3', oldPrice: '4', minOrder: 1000, deliveryDate: 'thu,29 jan', image: BOX_IMAGE },
  ];

  const reviews = [
    { name: 'Alex Mathio', rating: 4.3, text: 'The 250 ml hinged boxes are very practical and useful for everyday food packaging. Their compact size makes them perfect for storing small portions like snacks, sweets, dry fruits, desserts, or sauces.' }
  ];

  if (loading) return <div className="text-center py-20 font-bold text-slate-500">Loading product details...</div>;
  if (!product) return <div className="text-center py-20 font-bold text-red-500">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-8 py-10">
      <p className="text-slate-900 font-bold mb-8 text-xl">Home &gt; {product.size}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        {/* Left: Gallery */}
        <div className="space-y-4">
          <div className="aspect-[4/3] rounded-2xl border border-slate-100 overflow-hidden bg-slate-50">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-3 gap-4">
             {/* Using the same thumbnails image for all slots for demo */}
            <div className="aspect-square rounded-xl border border-slate-200 overflow-hidden cursor-pointer hover:border-blue-500 transition-colors">
              <img src={product.image} alt="Thumbnail 1" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-square rounded-xl border border-slate-200 overflow-hidden cursor-pointer hover:border-blue-500 transition-colors">
              <img src={product.image} alt="Thumbnail 2" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-square rounded-xl border border-slate-200 overflow-hidden cursor-pointer hover:border-blue-500 transition-colors">
              <img src={product.image} alt="Thumbnail 3" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">{product.name} {product.size}</h1>
          
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
            {product.oldPrice && <span className="text-2xl text-slate-300 line-through font-medium">₹{product.oldPrice}</span>}
            <span className="text-4xl font-bold text-slate-900">₹{product.price}/piece</span>
          </div>
          
          <p className="text-slate-500 font-bold mb-6 italic text-sm">Min order quantity= {product.minOrder}</p>

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
            <p>{product.description || "Designed for convenience and durability, this product provides a reliable packaging solution. Made from high-quality, food-grade materials, it helps maintain hygiene and freshness during storage and transport."}</p>
          </div>

          <div className="mb-8">
            <p className="text-blue-600 font-bold uppercase tracking-tight mb-4">FREE delivery {product.deliveryDate || "Soon"}</p>
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
