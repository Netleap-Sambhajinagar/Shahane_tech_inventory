import { useNavigate, Link } from 'react-router-dom';
import { Search, User, ShoppingCart, LogOut, ArrowLeft, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const { cartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
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
        {/* Search Button and Input */}
        <div className="relative">
          {!isSearchOpen ? (
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="text-slate-900 hover:text-slate-600 transition-colors"
              title="Search products"
            >
              <Search size={20} className="w-5 h-5" />
            </button>
          ) : (
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onKeyPress={handleSearchKeyPress}
                  placeholder="Search products..."
                  className="w-48 sm:w-64 px-3 py-1.5 pr-8 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                >
                  <Search size={16} className="w-4 h-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X size={16} className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
        
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
