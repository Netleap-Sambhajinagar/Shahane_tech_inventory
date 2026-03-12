import React from 'react';
import { Search, Bell, User } from 'lucide-react';

const Header = ({ title, subtitle }) => {
  const admin = JSON.parse(localStorage.getItem('admin'));

  return (
    <header className="flex items-center justify-between px-8 py-6 bg-transparent">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:text-slate-600 bg-white rounded-lg shadow-sm border border-slate-100">
            <Search size={20} />
          </button>
          <button className="p-2 text-slate-400 hover:text-slate-600 bg-white rounded-lg shadow-sm border border-slate-100 relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>

        <div className="h-10 w-[1px] bg-slate-200 mx-1"></div>

        <div className="flex items-center gap-3 bg-white p-1 pr-4 rounded-full shadow-sm border border-slate-100">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
            <User size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-900 leading-none">{admin?.name || 'Admin'}</span>
            <span className="text-[10px] text-slate-400 leading-none">{admin?.email || 'admin@shahane.tech'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
