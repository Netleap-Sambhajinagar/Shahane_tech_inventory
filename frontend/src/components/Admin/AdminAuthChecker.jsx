import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const AdminAuthChecker = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(!!localStorage.getItem('adminToken'));

  useEffect(() => {
    const checkAuth = () => {
      setIsAdminAuthenticated(!!localStorage.getItem('adminToken'));
    };

    // Check auth on mount and when storage changes
    checkAuth();
    
    // Listen for storage changes
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminAuthChecker;
