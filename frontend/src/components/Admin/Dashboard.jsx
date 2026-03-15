import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import ProductTable from './ProductTable';
import OrdersTable from './OrdersTable';
import LogoutModal from './LogoutModal';
import { removeItemWithEvent } from '../../utils/storage';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('products');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleTabChange = (tabId) => {
    if (tabId === 'logout') {
      setIsLogoutModalOpen(true);
      setActiveTab('dashboard'); // Reset active tab
    } else {
      setActiveTab(tabId);
    }
  };

  const getHeaderInfo = () => {
    switch(activeTab) {
      case 'products':
        return { title: 'Manage Products', subtitle: 'View and manage all products available in the store.' };
      case 'orders':
        return { title: 'Manage orders', subtitle: 'View and manage all orders available in the store.' };
      default:
        return { title: 'Dashboard', subtitle: 'Overview of your business.' };
    }
  };

  const { title, subtitle } = getHeaderInfo();

  return (
    <div className="flex min-h-screen relative">
      <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />
      <div className="flex-1 flex flex-col lg:ml-0">
        <Header title={title} subtitle={subtitle} />
        <main className="flex-1 overflow-x-auto">
          <div className="min-w-0">
            {activeTab === 'products' && <ProductTable />}
            {activeTab === 'orders' && <OrdersTable />}
            {activeTab !== 'products' && activeTab !== 'orders' && (
              <div className="flex-1 flex items-center justify-center text-slate-400 p-8">
                 Dashboard content coming soon...
              </div>
            )}
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
