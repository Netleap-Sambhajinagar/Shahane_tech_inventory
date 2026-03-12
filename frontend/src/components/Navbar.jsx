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
    <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 text-slate-400 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center shadow-sm border border-slate-200"
          title="Go Back"
        >
          <ArrowLeft size={20} className="w-5 h-5" />
        </button>
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="bg-slate-900 p-1.5 rounded">
            <div className="w-5 h-5 border-2 border-white rotate-45 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-tight uppercase text-slate-900">Shahane</h1>
            <p className="text-[9px] text-slate-400 font-medium tracking-widest leading-none text-center">TECH MARKETING LLP</p>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-6">
        <button className="text-slate-900 hover:text-slate-600 transition-colors">
          <Search size={24} />
        </button>
        
        {user ? (
          <div className="flex items-center gap-4">
            <Link to="/account" className="flex items-center gap-2 text-slate-900 hover:text-slate-600 transition-colors font-bold text-sm bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <User size={18} />
              {user.name}
            </Link>
            <button 
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <LogOut size={22} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
             <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">
                Sign In
              </Link>
              <Link to="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all">
                Join
              </Link>
          </div>
        )}
        
        <button className="text-slate-900 hover:text-slate-600 transition-colors relative">
          <ShoppingCart size={24} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full border-2 border-white animate-pulse"></span>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
