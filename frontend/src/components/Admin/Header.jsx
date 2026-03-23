import React, { useState, useEffect } from 'react';
import { Search, Bell, User, X } from 'lucide-react';
import Notifications from './Notifications';

const Header = ({ title, subtitle, globalSearchTerm, onGlobalSearch, isSearchOpen, toggleSearch, activeTab }) => {
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const admin = JSON.parse(localStorage.getItem('admin'));

  // Sync local search term with global search term
  useEffect(() => {
    setLocalSearchTerm(globalSearchTerm);
  }, [globalSearchTerm]);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setLocalSearchTerm(term);
    onGlobalSearch(term);
  };

  const handleClearSearch = () => {
    setLocalSearchTerm('');
    onGlobalSearch('');
  };

  const getSearchPlaceholder = () => {
    switch(activeTab) {
      case 'products':
        return 'Search products...';
      case 'orders':
        return 'Search orders...';
      default:
        return 'Search...';
    }
  };

  return (
    <header className="fixed top-0 left-64 right-0 z-50 flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-8 py-4 sm:py-6 bg-white border-b border-slate-200 gap-4 sm:gap-0">
      <div className="min-w-0 flex-1">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">{title}</h2>
        <p className="text-xs sm:text-sm text-slate-500 truncate">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
        <Notifications />
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Search Input */}
          <div className="relative">
            {isSearchOpen && (
              <div className="absolute right-0 top-0 z-50">
                <input
                  type="text"
                  value={localSearchTerm}
                  onChange={handleSearchChange}
                  placeholder={getSearchPlaceholder()}
                  className="px-4 py-2 pr-10 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 sm:w-80 shadow-lg"
                  autoFocus
                />
                <button
                  onClick={handleClearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                  title="Clear search"
                >
                  <X size={16} className="w-4 h-4" />
                </button>
              </div>
            )}
            <button 
              onClick={toggleSearch}
              className={`p-2 rounded-lg shadow-sm border transition-colors ${
                isSearchOpen 
                  ? 'text-blue-600 bg-blue-50 border-blue-200' 
                  : 'text-slate-400 hover:text-slate-600 bg-white border-slate-100'
              }`}
              title={isSearchOpen ? 'Close search' : 'Search'}
            >
              <Search size={18} className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden sm:block"></div>

        <div className="flex items-center gap-2 sm:gap-3 bg-white p-1 pr-2 sm:pr-4 rounded-full shadow-sm border border-slate-100">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
            <User size={14} className="w-3 h-3 sm:w-4 sm:h-4 sm:text-base" />
          </div>
          <div className="hidden sm:block min-w-0">
            <p className="text-xs sm:text-sm font-medium text-slate-900 truncate">{admin?.name || 'Admin'}</p>
            <p className="text-[9px] text-slate-500 truncate">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
