import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Account from './pages/Account';
import Checkout from './pages/Checkout';
import CartPage from './pages/CartPage';
import OrderConfirmation from './pages/OrderConfirmation';
import OrderTracking from './pages/OrderTracking';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ChatWidget from './components/ChatWidget';
import AdminDashboard from './components/Admin/Dashboard';
import AdminLogin from './pages/AdminPages/Login';
import AdminSignup from './pages/AdminPages/Signup';
import { setItemWithEvent, removeItemWithEvent } from './utils/storage';

function App() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(!!localStorage.getItem('adminToken'));

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('adminToken');
      setIsAdminAuthenticated(!!token);
    };

    // Check on mount
    checkAuth();
    
    // Listen for storage changes from other tabs
    window.addEventListener('storage', (e) => {
      if (e.key === 'adminToken') {
        checkAuth();
      }
    });

    // Listen for custom storage events (same-tab updates)
    window.addEventListener('localStorageUpdated', (e) => {
      if (e.detail.key === 'adminToken') {
        checkAuth();
      }
    });

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('localStorageUpdated', checkAuth);
    };
  }, []);

  return (
    <CartProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-white">
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={isAdminAuthenticated ? <Navigate to="/admin" replace /> : <AdminLogin />} />
            <Route path="/admin/register" element={<AdminSignup />} />
            <Route 
              path="/admin/*" 
              element={isAdminAuthenticated ? <AdminDashboard /> : <Navigate to="/admin/login" replace />} 
            />
            
            {/* Customer Routes */}
            <Route path="/" element={
              <>
                <Navbar />
                <Home />
              </>
            } />
            <Route path="/product/:id" element={
              <>
                <Navbar />
                <ProductDetails />
              </>
            } />
            <Route path="/account" element={
              <>
                <Navbar />
                <Account />
              </>
            } />
            <Route path="/cart" element={
              <>
                <Navbar />
                <CartPage />
              </>
            } />
            <Route path="/checkout" element={
              <>
                <Navbar />
                <Checkout />
              </>
            } />
            <Route path="/order-confirmation" element={
              <>
                <Navbar />
                <OrderConfirmation />
              </>
            } />
            <Route path="/order-tracking" element={
              <>
                <Navbar />
                <OrderTracking />
              </>
            } />
            <Route path="/login" element={
              <>
                <Navbar />
                <Login />
              </>
            } />
            <Route path="/signup" element={
              <>
                <Navbar />
                <Signup />
              </>
            } />
          </Routes>
          <ChatWidget />
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
