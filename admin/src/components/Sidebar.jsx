import React from 'react';
import { LayoutDashboard, Package, ShoppingCart, LogOut } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { id: 'products', icon: <Package size={20} />, label: 'Products' },
    { id: 'orders', icon: <ShoppingCart size={20} />, label: 'Orders' },
    { id: 'logout', icon: <LogOut size={20} />, label: 'Logout' },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col p-6 sticky top-0">
      <div className="flex items-center gap-2 mb-10 overflow-hidden">
        <div className="bg-slate-900 p-1.5 rounded">
          <div className="w-5 h-5 border-2 border-white rotate-45 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight tracking-tight uppercase">Shahane</h1>
          <p className="text-[9px] text-slate-400 font-medium tracking-widest leading-none">TECH MARKETING LLP</p>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === item.id 
                ? 'bg-slate-500 text-white shadow-md' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            } ${item.className || ''}`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
