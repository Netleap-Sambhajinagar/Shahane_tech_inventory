import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ProductTable from './components/ProductTable';
import OrdersTable from './components/OrdersTable';
import LogoutModal from './components/LogoutModal';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('products');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleTabChange = (tabId) => {
    if (tabId === 'logout') {
      setIsLogoutModalOpen(true);
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
      <div className="flex-1 flex flex-col">
        <Header title={title} subtitle={subtitle} />
        <main className="flex-1">
          {activeTab === 'products' && <ProductTable />}
          {activeTab === 'orders' && <OrdersTable />}
          {activeTab !== 'products' && activeTab !== 'orders' && (
            <div className="flex-1 flex items-center justify-center text-slate-400">
               Dashboard content coming soon...
            </div>
          )}
        </main>
      </div>

      <LogoutModal 
        isOpen={isLogoutModalOpen} 
        onClose={() => setIsLogoutModalOpen(false)} 
        onConfirm={() => {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('admin');
          window.location.href = '/login';
        }} 
      />
    </div>
  );
}

function App() {
  const isAdminAuthenticated = !!localStorage.getItem('adminToken');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={isAdminAuthenticated ? <Navigate to="/" /> : <Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route 
          path="/*" 
          element={isAdminAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
