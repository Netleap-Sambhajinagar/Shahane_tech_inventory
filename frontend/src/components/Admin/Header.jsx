import React from 'react';
import { Search, Bell, User } from 'lucide-react';
import Notifications from './Notifications';

const Header = ({ title, subtitle }) => {
  const admin = JSON.parse(localStorage.getItem('admin'));

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-8 py-4 sm:py-6 bg-transparent gap-4 sm:gap-0">
      <div className="min-w-0 flex-1">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">{title}</h2>
        <p className="text-xs sm:text-sm text-slate-500 truncate">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
        <Notifications />
        <div className="flex items-center gap-2 sm:gap-4">
          <button className="p-2 text-slate-400 hover:text-slate-600 bg-white rounded-lg shadow-sm border border-slate-100">
            <Search size={18} className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button className="p-2 text-slate-400 hover:text-slate-600 bg-white rounded-lg shadow-sm border border-slate-100 relative">
            <Bell size={18} className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
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
