import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, Pencil, Trash2, Truck, ChevronRight, Search } from 'lucide-react';
import { makeAuthenticatedRequest } from '../../utils/auth';

const OrdersTable = ({ globalSearchTerm = '' }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelDescription, setCancelDescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Handle dispatch - change status from Pending to In transmit for specific product
  const handleDispatch = async (orderId, productId, productQuantity) => {
    console.log(`Attempting to dispatch product ${productId} from order ${orderId}, quantity: ${productQuantity}`);
    
    // Safety checks
    if (!orderId || !productId || !productQuantity) {
      console.error('Missing required parameters:', { orderId, productId, productQuantity });
      alert('Missing order information. Please refresh and try again.');
      return;
    }
    
    const dispatchUrl = `http://localhost:5000/api/orders/${orderId}/dispatch/${productId}`;
    console.log('Dispatch URL:', dispatchUrl);
    
    try {
      const response = await makeAuthenticatedRequest(dispatchUrl, {
        method: 'PUT',
        body: JSON.stringify({ quantity: productQuantity })
      });
      
      console.log('Dispatch response:', response);
      
      // Refresh orders to show updated inventory
      makeAuthenticatedRequest('http://localhost:5000/api/orders')
        .then(data => {
          setOrders(data);
          setError(null);
        })
        .catch(err => {
          console.error('Error refreshing orders:', err);
        });
      
      // Also refresh products to show updated inventory
      makeAuthenticatedRequest('http://localhost:5000/api/products')
        .then(data => {
          // Update products in admin panel if needed
          console.log('Products refreshed:', data);
        })
        .catch(err => {
          console.error('Error refreshing products:', err);
        });
      
      console.log('Product dispatched successfully');
    } catch (err) {
      console.error('Error dispatching product:', err);
      console.error('Error details:', err.message, err.stack);
      console.error('Full error object:', err);
      alert(`Failed to dispatch product: ${err.message || 'Unknown error'}`);
    }
  };

  // Handle delete order
  const handleDelete = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }
    
    try {
      const response = await makeAuthenticatedRequest(`http://localhost:5000/api/orders/${orderId}`, {
        method: 'DELETE'
      });
      
      // Remove order from local state
      setOrders(orders.filter(order => order.id !== orderId));
      
      console.log('Order deleted successfully:', orderId);
    } catch (err) {
      console.error('Error deleting order:', err);
      alert('Failed to delete order. Please try again.');
    }
  };

  // Handle cancel order with reason
  const handleCancelOrder = (order) => {
    console.log('=== CANCEL ORDER CLICKED ===');
    console.log('Order data:', order);
    console.log('Order ID:', order.id);
    console.log('Order Status:', order.status);
    console.log('============================');
    
    setSelectedOrder(order);
    setShowCancelModal(true);
    setCancelReason('');
    setCancelDescription('');
  };

  // Confirm order cancellation
  const confirmCancelOrder = async () => {
    if (!cancelReason.trim()) {
      alert('Please provide a cancellation reason.');
      return;
    }

    console.log('=== CANCELLING ORDER DEBUG ===');
    console.log('Selected Order:', selectedOrder);
    console.log('Cancel Reason:', cancelReason);
    console.log('Cancel Description:', cancelDescription);
    console.log('Order ID:', selectedOrder?.id);
    console.log('================================');

    try {
      const response = await makeAuthenticatedRequest(`http://localhost:5000/api/orders/${selectedOrder.id}`, {
        method: 'PUT',
        body: JSON.stringify({ 
          status: 'Cancelled',
          cancellation_reason: cancelReason,
          cancellation_description: cancelDescription
        })
      });
      
      console.log('Cancel response:', response);
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === selectedOrder.id 
          ? { ...order, status: 'Cancelled', cancellation_reason: cancelReason, cancellation_description: cancelDescription }
          : order
      ));
      
      console.log('Order cancelled successfully:', selectedOrder.id);
      setShowCancelModal(false);
      setSelectedOrder(null);
      alert('Order cancelled successfully!');
    } catch (err) {
      console.error('Error cancelling order:', err);
      console.error('Full error details:', err);
      alert(`Failed to cancel order: ${err.message || 'Unknown error'}`);
    }
  };

  useEffect(() => {
    console.log('OrdersTable: Fetching orders...');
    const adminToken = localStorage.getItem('adminToken');
    console.log('Admin token found:', adminToken);
    
    // Force fresh fetch by adding timestamp
    const timestamp = new Date().getTime();
    makeAuthenticatedRequest(`http://localhost:5000/api/orders?t=${timestamp}`)
      .then(data => {
        console.log('Orders fetched successfully:', data);
        console.log('Order data structure check:');
        data.forEach((order, index) => {
          console.log(`Order ${index}:`, {
            id: order.id,
            order_id: order.order_id,
            items: order.items,
            itemsCount: order.items ? order.items.length : 0
          });
          if (order.items && order.items.length > 0) {
            order.items.forEach((item, itemIndex) => {
              console.log(`  Item ${itemIndex}:`, {
                product_id: item.product_id,
                product_name: item.product_name,
                quantity: item.quantity
              });
            });
          }
        });
        setOrders(data);
        setFilteredOrders(data);
        setLoading(false);
        setError(null);
      })
      .catch(err => {
        console.error('Error fetching orders:', err);
        setLoading(false);
        setError(err.message || 'Failed to fetch orders. Please check your authentication.');
      });
  }, []);

  // Filter orders based on search term
  useEffect(() => {
    try {
      // Use global search term if provided, otherwise use local search term
      const currentSearchTerm = globalSearchTerm || searchTerm;
      console.log('Search term:', currentSearchTerm);
      console.log('Orders count:', orders.length);
      
      if (currentSearchTerm.trim() === '') {
        setFilteredOrders(orders);
        console.log('Search cleared, showing all orders');
      } else {
        const filtered = orders.filter(order => {
          const orderId = (order.order_id?.toString() || '').toLowerCase();
          const customerId = (order.customer_id?.toString() || '').toLowerCase();
          const city = (order.city || '').toLowerCase();
          const customerType = (order.customer_type || '').toLowerCase();
          const status = (order.status || '').toLowerCase();
          const orderDate = (order.order_date || '').toLowerCase();
          const searchTermLower = currentSearchTerm.toLowerCase();
          
          return orderId.includes(searchTermLower) ||
                 customerId.includes(searchTermLower) ||
                 city.includes(searchTermLower) ||
                 customerType.includes(searchTermLower) ||
                 status.includes(searchTermLower) ||
                 orderDate.includes(searchTermLower);
        });
        console.log('Filtered orders count:', filtered.length);
        setFilteredOrders(filtered);
      }
    } catch (error) {
      console.error('Error in search filtering:', error);
      setFilteredOrders(orders);
    }
  }, [globalSearchTerm, searchTerm, orders]);

  // Auto-refresh orders every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Auto-refreshing orders...');
      makeAuthenticatedRequest('http://localhost:5000/api/orders')
        .then(data => {
          setOrders(data);
          setFilteredOrders(data);
          setError(null);
        })
        .catch(err => {
          console.error('Error auto-refreshing orders:', err);
        });
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    try {
      setSearchTerm(e.target.value);
    } catch (error) {
      console.error('Error in handleSearchChange:', error);
    }
  };

  // Display the current search term in empty state
  const displaySearchTerm = globalSearchTerm || searchTerm;

  if (loading) {
    return (
      <div className="px-2 sm:px-4 lg:px-8 flex-1">
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-400">Loading orders...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-2 sm:px-4 lg:px-8 flex-1">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500 text-center">
            <p className="mb-2">⚠️ {error}</p>
            <p className="text-sm text-slate-500">Please try refreshing the page or contact support.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-2 sm:px-4 lg:px-8 flex-1">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-4">
        <div className="flex gap-2 sm:gap-3 flex-wrap">
          <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
            <SlidersHorizontal size={16} className="w-4 h-4" />
          </button>
          <button className="px-3 sm:px-5 py-1.5 bg-white border border-slate-200 rounded-full text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-50">
            Size
          </button>
          <button className="px-3 sm:px-5 py-1.5 bg-white border border-slate-200 rounded-full text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-50">
            Price
          </button>
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search orders..."
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs sm:text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 sm:w-64"
            />
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
              title="Clear search"
            >
              <Search size={14} className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <button className="px-4 sm:px-6 py-2 sm:py-2.5 bg-slate-900 text-white rounded-lg text-xs sm:text-sm font-bold shadow-lg hover:bg-slate-800 transition-colors uppercase tracking-tight whitespace-nowrap">
          Add New Order
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Mobile Card View */}
        <div className="lg:hidden">
          {filteredOrders.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <p>No orders found matching "{displaySearchTerm}"</p>
            </div>
          ) : (
            filteredOrders.map((order, index) => (
            <div key={index} className="p-4 border-b border-slate-100 last:border-b-0">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium text-slate-900 text-sm">Order #{order.order_id}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  order.status === 'Delivered' 
                    ? 'text-green-500 bg-green-50' 
                    : 'text-blue-500 bg-blue-50'
                }`}>
                  {order.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div>
                  <span className="text-slate-400">Customer:</span>
                  <span className="ml-1 font-medium text-slate-600">{order.customer_id}</span>
                </div>
                <div>
                  <span className="text-slate-400">City:</span>
                  <span className="ml-1 font-medium text-slate-600">{order.city}</span>
                </div>
                <div>
                  <span className="text-slate-400">Type:</span>
                  <span className="ml-1 font-medium text-slate-600">{order.customer_type}</span>
                </div>
                <div>
                  <span className="text-slate-400">Date:</span>
                  <span className="ml-1 font-medium text-slate-600">{order.order_date}</span>
                </div>
              </div>
              
              {/* Order Items */}
              <div className="mb-3">
                <h4 className="text-xs font-semibold text-slate-700 mb-2">Order Items:</h4>
                <div className="space-y-2">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, itemIndex) => {
                      console.log('Rendering order item:', item);
                      console.log('Order ID:', order.id);
                      console.log('Product ID:', item.product_id);
                      console.log('Quantity:', item.quantity);
                      
                      // Safety check
                      if (!item.product_id || !item.quantity) {
                        console.error('Invalid item data:', item);
                        return null;
                      }
                      
                      return (
                        <div key={itemIndex} className="bg-slate-50 rounded p-2 flex justify-between items-center">
                          <div className="flex-1">
                            <p className="text-xs font-medium text-slate-900">{item.product_name}</p>
                            <p className="text-[10px] text-slate-600">
                              {item.product_id} • Qty: {item.quantity} • ₹{item.price}/unit
                            </p>
                          </div>
                          <button 
                            onClick={() => {
                              console.log('Dispatch button clicked!');
                              console.log('Order ID:', order.id, 'Product ID:', item.product_id, 'Quantity:', item.quantity);
                              
                              // Safety check before calling handleDispatch
                              if (order.id && item.product_id && item.quantity) {
                                handleDispatch(order.id, item.product_id, item.quantity);
                              } else {
                                console.error('Cannot dispatch - missing data');
                                alert('Cannot dispatch - missing product information');
                              }
                            }}
                            className="px-2 py-1 bg-blue-600 text-white text-[10px] rounded hover:bg-blue-700 transition-colors flex items-center gap-1"
                            title={`Dispatch ${item.product_name}`}
                          >
                            <Truck size={10} />
                            Dispatch
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-slate-500 italic">No items found</p>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-50">
                <button 
                  onClick={() => handleCancelOrder(order)}
                  disabled={order.status === 'Cancelled' || order.status === 'Delivered'}
                  className={`transition-colors ${
                    order.status !== 'Cancelled' && order.status !== 'Delivered'
                      ? 'text-orange-400 hover:text-orange-600' 
                      : 'text-slate-300 cursor-not-allowed'
                  }`}
                  title={order.status !== 'Cancelled' && order.status !== 'Delivered' ? 'Cancel Order' : 'Cannot cancel - already processed'}
                >
                  <Trash2 size={16} strokeWidth={2.5} />
                </button>
                <button 
                  onClick={() => handleDelete(order.id)}
                  className="text-slate-400 hover:text-red-600 transition-colors"
                  title="Delete Order"
                >
                  <Trash2 size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          ))
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Order_ID</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Customer_ID</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">City</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Customer_Type</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Order_Date</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">State</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">prize</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-8 text-center text-slate-400">
                    No orders found matching "{displaySearchTerm}"
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order, index) => (
                <tr key={index} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-4 text-xs font-medium text-slate-600">{order.order_id}</td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-400">{order.customer_id}</td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-400">{order.city}</td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-400">{order.customer_type}</td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-400 font-mono tracking-tighter">{order.order_date}</td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-400">{order.state}</td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-400 font-mono tracking-tighter">{order.prize}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      order.status === 'Delivered' 
                        ? 'text-green-500 bg-green-50' 
                        : 'text-blue-500 bg-blue-50'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-4">
                      <button 
                        onClick={() => {
                          // For desktop view, dispatch all items in the order
                          if (order.items && order.items.length > 0) {
                            // Dispatch each item in the order
                            order.items.forEach(item => {
                              if (item.product_id && item.quantity) {
                                handleDispatch(order.id, item.product_id, item.quantity);
                              }
                            });
                          } else {
                            console.error('No items found in order');
                            alert('No items found in order to dispatch');
                          }
                        }}
                        disabled={order.status !== 'Pending'}
                        className={`transition-colors ${
                          order.status === 'Pending' 
                            ? 'text-blue-400 hover:text-blue-600' 
                            : 'text-slate-300 cursor-not-allowed'
                        }`}
                        title={order.status === 'Pending' ? 'Dispatch All Items' : 'Cannot dispatch - not pending'}
                      >
                        <Truck size={16} strokeWidth={2.5} />
                      </button>
                      <button 
                        onClick={() => handleCancelOrder(order)}
                        disabled={order.status === 'Cancelled' || order.status === 'Delivered'}
                        className={`transition-colors ${
                          order.status !== 'Cancelled' && order.status !== 'Delivered'
                            ? 'text-orange-400 hover:text-orange-600' 
                            : 'text-slate-300 cursor-not-allowed'
                        }`}
                        title={order.status !== 'Cancelled' && order.status !== 'Delivered' ? 'Cancel Order' : 'Cannot cancel - already processed'}
                      >
                        <Trash2 size={16} strokeWidth={2.5} />
                      </button>
                      <button 
                        onClick={() => handleDelete(order.id)}
                        className="text-slate-400 hover:text-red-600 transition-colors"
                        title="Delete Order"
                      >
                        <Trash2 size={16} strokeWidth={2.5} />
                      </button>
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 sm:px-6 py-4 bg-slate-50/30 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-medium">Row per Pages</span>
            <div className="px-2 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-700 shadow-sm">
              10
            </div>
          </div>
          <button className="flex items-center gap-1 px-4 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm">
            see more <ChevronRight size={14} />
          </button>
        </div>
      </div>
      <div className="h-10"></div>

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Cancel Order</h3>
            <p className="text-sm text-slate-600 mb-4">
              Are you sure you want to cancel order {selectedOrder?.order_id}?
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Cancellation Reason *
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a reason</option>
                <option value="Out of stock">Out of stock</option>
                <option value="Payment issue">Payment issue</option>
                <option value="Customer request">Customer request</option>
                <option value="Shipping delay">Shipping delay</option>
                <option value="Quality issue">Quality issue</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Additional Description
              </label>
              <textarea
                value={cancelDescription}
                onChange={(e) => setCancelDescription(e.target.value)}
                placeholder="Provide additional details about the cancellation..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
              />
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={confirmCancelOrder}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersTable;
