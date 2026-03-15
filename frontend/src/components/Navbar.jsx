import { useNavigate, Link } from 'react-router-dom';
import { Search, User, ShoppingCart, LogOut, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const { cartCount } = useCart();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="flex items-center gap-4 sm:gap-6">
        <button 
          onClick={() => navigate(-1)} 
          className="p-1.5 sm:p-2 -ml-2 sm:-ml-2 text-slate-400 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center shadow-sm border border-slate-200"
          title="Go Back"
        >
          <ArrowLeft size={16} className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img 
            src="/Logo.jpeg" 
            alt="Shahane Tech Marketing LLP" 
            className="h-6 sm:h-8 w-auto object-contain"
          />
        </Link>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        <button className="text-slate-900 hover:text-slate-600 transition-colors">
          <Search size={20} className="w-5 h-5" />
        </button>
        
        {user ? (
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/account" className="flex items-center gap-2 text-slate-900 hover:text-slate-600 transition-colors font-bold text-xs sm:text-sm bg-slate-50 px-2 sm:px-3 py-1.5 rounded-lg border border-slate-200">
              <User size={14} className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{user.name}</span>
            </Link>
            <button 
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <LogOut size={18} className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3">
             <Link to="/login" className="text-xs sm:text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">
                Sign In
              </Link>
              <Link to="/signup" className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg text-xs sm:text-sm font-bold hover:bg-blue-700 transition-all">
                Join
              </Link>
          </div>
        )}
        
        <Link to="/cart" className="text-slate-900 hover:text-slate-600 transition-colors relative">
          <ShoppingCart size={20} className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-600 rounded-full border-2 border-white animate-pulse"></span>
          )}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
