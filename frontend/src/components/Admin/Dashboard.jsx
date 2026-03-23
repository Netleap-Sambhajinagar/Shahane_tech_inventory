import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import ProductTable from './ProductTable';
import OrdersTable from './OrdersTable';
import SalesDashboard from './SalesDashboard';
import LogoutModal from './LogoutModal';
import { removeItemWithEvent } from '../../utils/storage';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  const handleTabChange = (tabId) => {
    if (tabId === 'logout') {
      setIsLogoutModalOpen(true);
      setActiveTab('dashboard'); // Reset active tab
    } else {
      setActiveTab(tabId);
      // Clear search when switching tabs
      setGlobalSearchTerm('');
      setIsSearchOpen(false);
    }
  };

  const handleGlobalSearch = (term) => {
    setGlobalSearchTerm(term);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const getHeaderInfo = () => {
    switch(activeTab) {
      case 'products':
        return { title: 'Manage Products', subtitle: 'View and manage all products available in the store.' };
      case 'orders':
        return { title: 'Manage orders', subtitle: 'View and manage all orders available in the store.' };
      case 'dashboard':
        return { title: 'Sales Analytics', subtitle: 'Comprehensive overview of sales performance.' };
      default:
        return { title: 'Dashboard', subtitle: 'Overview of your business.' };
    }
  };

  const { title, subtitle } = getHeaderInfo();

  return (
    <div className="flex min-h-screen relative">
      <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />
      <div className="flex-1 flex flex-col lg:ml-64 pt-20">
        <Header 
        title={title} 
        subtitle={subtitle} 
        globalSearchTerm={globalSearchTerm}
        onGlobalSearch={handleGlobalSearch}
        isSearchOpen={isSearchOpen}
        toggleSearch={toggleSearch}
        activeTab={activeTab}
      />
        <main className="flex-1 overflow-auto">
          <div className="p-6 min-w-full">
            {activeTab === 'dashboard' && <SalesDashboard />}
            {activeTab === 'products' && <ProductTable globalSearchTerm={globalSearchTerm} />}
            {activeTab === 'orders' && <OrdersTable globalSearchTerm={globalSearchTerm} />}
          </div>
        </main>
      </div>

      <LogoutModal 
        isOpen={isLogoutModalOpen} 
        onClose={() => setIsLogoutModalOpen(false)} 
        onConfirm={() => {
          removeItemWithEvent('adminToken');
          removeItemWithEvent('admin');
          navigate('/admin/login');
        }} 
      />
    </div>
  );
}

export default AdminDashboard;
