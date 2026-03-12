import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ id, name, size, price, oldPrice, minOrder, deliveryDate, image }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ id, name, size, price, image });
    // Keep user on page so they can see the red dot feedback
  };

  return (
    <Link to={`/product/${id}`} className="block border border-slate-100 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white">
      <div className="aspect-square w-full bg-slate-50 relative overflow-hidden group">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      
      <div className="p-4 flex flex-col gap-1">
        <h3 className="text-lg font-bold text-slate-900 line-height-tight">{name}</h3>
        <p className="text-lg font-bold text-slate-900 line-height-tight mb-1">{size}</p>
        
        <div className="flex items-center gap-2 mb-2">
          <span className="text-slate-400 text-sm line-through">₹{oldPrice}</span>
          <span className="text-2xl font-bold text-slate-900">₹{price}/piece</span>
        </div>

        <div className="text-[10px] space-y-0.5 mb-4">
          <p className="text-slate-500 font-medium">Min order quantity= {minOrder}</p>
          <p className="text-slate-400 uppercase font-bold tracking-tighter">FREE delivery {deliveryDate}</p>
        </div>

        <button 
          onClick={handleAddToCart}
          className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg active:scale-[0.98]"
        >
          Add to cart
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
