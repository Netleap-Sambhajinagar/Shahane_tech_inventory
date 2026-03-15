import React, { useState, useEffect } from 'react';
import { Bell, X, Package, ShoppingCart } from 'lucide-react';
import { makeAuthenticatedRequest } from '../../utils/auth';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Manual check function that can be called from other components
  const manualCheckForNewOrders = async () => {
    try {
      const orders = await makeAuthenticatedRequest('http://localhost:5000/api/orders');
      const seenOrderIds = JSON.parse(localStorage.getItem('seenOrderIds') || '[]');
      
      // Find orders that haven't been seen yet
      const newOrders = orders.filter(order => !seenOrderIds.includes(order.order_id));

      if (newOrders.length > 0) {
        console.log('Manual check found new orders:', newOrders);
        
        // Add notifications for new orders
        const newNotifications = newOrders.map(order => ({
          id: `order-${order.order_id}`,
          type: 'order',
          title: 'New Order Received',
          message: `Order #${order.order_id} from ${order.city}`,
          timestamp: new Date().toISOString(),
          read: false,
          data: order
        }));

        setNotifications(prev => {
          const existingIds = new Set(prev.map(n => n.id));
          const uniqueNewNotifications = newNotifications.filter(n => !existingIds.has(n.id));
          return [...uniqueNewNotifications, ...prev];
        });
        
        setUnreadCount(prev => prev + newOrders.length);
        
        // Update seen order IDs
        const updatedSeenIds = [...seenOrderIds, ...newOrders.map(order => order.order_id)];
        localStorage.setItem('seenOrderIds', JSON.stringify(updatedSeenIds));
      }
    } catch (error) {
      console.error('Error in manual order check:', error);
    }
  };

  useEffect(() => {
    // Clean up corrupted localStorage data on mount
    const seenOrderIds = JSON.parse(localStorage.getItem('seenOrderIds') || '[]');
    const lastCheckedTime = localStorage.getItem('lastOrderCheck');
    
    // If we have corrupted data (using numeric IDs instead of order_id), clear it
    if (seenOrderIds.length > 0 && typeof seenOrderIds[0] === 'number') {
      console.log('Cleaning up corrupted localStorage data');
      localStorage.removeItem('seenOrderIds');
      localStorage.removeItem('lastOrderCheck');
    }
    
    // Expose the manual check function globally for other components to call
    window.triggerNotificationCheck = manualCheckForNewOrders;
    
    // Check for new orders every 30 seconds
    const checkForNewOrders = async () => {
      try {
        const orders = await makeAuthenticatedRequest('http://localhost:5000/api/orders');
        const lastCheckedTime = localStorage.getItem('lastOrderCheck');
        
        // Get the latest order IDs from localStorage to track what we've already seen
        const seenOrderIds = JSON.parse(localStorage.getItem('seenOrderIds') || '[]');
        
        // Find orders that haven't been seen yet
        const newOrders = orders.filter(order => {
          // Check if we've already seen this order ID
          if (seenOrderIds.includes(order.order_id)) {
            return false;
          }
          
          // Also check by timestamp as a fallback
          const orderDate = new Date(order.order_date);
          const lastCheck = lastCheckedTime ? new Date(lastCheckedTime) : new Date(0);
          
          // If order_date is just a date (no time), use today's date for comparison
          if (orderDate.toTimeString() === '00:00:00') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return orderDate >= today;
          }
          
          return orderDate > lastCheck;
        });

        if (newOrders.length > 0) {
          console.log('Found new orders:', newOrders);
          
          // Add notifications for new orders (avoid duplicates)
          const newNotifications = newOrders.map(order => ({
            id: `order-${order.order_id}`,
            type: 'order',
            title: 'New Order Received',
            message: `Order #${order.order_id} from ${order.city}`,
            timestamp: new Date().toISOString(), // Use current time for notification
            read: false,
            data: order
          }));

          setNotifications(prev => {
            // Filter out any existing notifications with the same IDs
            const existingIds = new Set(prev.map(n => n.id));
            const uniqueNewNotifications = newNotifications.filter(n => !existingIds.has(n.id));
            return [...uniqueNewNotifications, ...prev];
          });
          
          setUnreadCount(prev => prev + newOrders.length);
          
          // Update seen order IDs
          const updatedSeenIds = [...seenOrderIds, ...newOrders.map(order => order.order_id)];
          localStorage.setItem('seenOrderIds', JSON.stringify(updatedSeenIds));
          
          // Update last check time
          localStorage.setItem('lastOrderCheck', new Date().toISOString());
        }
      } catch (error) {
        console.error('Error checking for new orders:', error);
      }
    };

    // Auto-cleanup old notifications (older than 24 hours)
    const cleanupOldNotifications = () => {
      setNotifications(prev => {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return prev.filter(notif => new Date(notif.timestamp) > twentyFourHoursAgo);
      });
    };

    // Initial check
    checkForNewOrders();

    // Set up intervals
    const orderCheckInterval = setInterval(checkForNewOrders, 30000); // 30 seconds
    const cleanupInterval = setInterval(cleanupOldNotifications, 60000); // 1 minute

    return () => {
      clearInterval(orderCheckInterval);
      clearInterval(cleanupInterval);
    };
  }, []);

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev => {
      const notification = prev.find(notif => notif.id === notificationId);
      if (notification && !notification.read) {
        setUnreadCount(count => Math.max(0, count - 1));
      }
      return prev.filter(notif => notif.id !== notificationId);
    });
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
    // Reset seen order IDs when clearing all notifications
    localStorage.removeItem('seenOrderIds');
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return <ShoppingCart size={16} />;
      default:
        return <Package size={16} />;
    }
  };

  return (
    <div className="relative">
      {/* Notification Button */}
      <button
        onClick={() => {
          if (unreadCount > 0) {
            clearAll();
          } else {
            setIsOpen(!isOpen);
          }
        }}
        className="relative p-2 text-slate-400 hover:text-slate-600 bg-white rounded-lg shadow-sm border border-slate-100 transition-colors"
        title={unreadCount > 0 ? 'Clear all notifications' : 'View notifications'}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {isOpen && (
        <div className="absolute top-12 right-0 w-96 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 max-h-96 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-100">
            <h3 className="text-lg font-semibold text-slate-900">Notifications</h3>
            <button
              onClick={clearAll}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear All
            </button>
          </div>

          <div className="overflow-y-auto max-h-80">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Package size={32} className="mx-auto mb-2 text-slate-300" />
                <p>No new notifications</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors ${
                    !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'opacity-75'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      notification.type === 'order' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div 
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`font-medium text-sm ${
                          !notification.read ? 'text-slate-900' : 'text-slate-600'
                        }`}>
                          {notification.title}
                          {!notification.read && (
                            <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </h4>
                        <span className="text-xs text-slate-400">
                          {new Date(notification.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className={`text-sm ${
                        !notification.read ? 'text-slate-600' : 'text-slate-500'
                      }`}>{notification.message}</p>
                      {notification.data && (
                        <div className="text-xs text-slate-400 mt-2">
                          Order ID: #{notification.data.order_id} | Total: ₹{notification.data.prize}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                      title="Delete notification"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
