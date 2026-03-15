import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, Pencil, Trash2, ChevronRight } from 'lucide-react';
import { makeAuthenticatedRequest } from '../../utils/auth';

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    makeAuthenticatedRequest('http://localhost:5000/api/orders')
      .then(data => {
        setOrders(data);
        setLoading(false);
        setError(null);
      })
      .catch(err => {
        console.error('Error fetching orders:', err);
        setLoading(false);
        setError(err.message || 'Failed to fetch orders. Please check your authentication.');
      });
  }, []);

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
        </div>
        <button className="px-4 sm:px-6 py-2 sm:py-2.5 bg-slate-900 text-white rounded-lg text-xs sm:text-sm font-bold shadow-lg hover:bg-slate-800 transition-colors uppercase tracking-tight whitespace-nowrap">
          Add New Order
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Mobile Card View */}
        <div className="lg:hidden">
          {orders.map((order, index) => (
            <div key={index} className="p-4 border-b border-slate-100 last:border-b-0">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium text-slate-900 text-sm">Order #{order.orderId}</h3>
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
                  <span className="ml-1 font-medium text-slate-600">{order.customerId}</span>
                </div>
                <div>
                  <span className="text-slate-400">City:</span>
                  <span className="ml-1 font-medium text-slate-600">{order.city}</span>
                </div>
                <div>
                  <span className="text-slate-400">Type:</span>
                  <span className="ml-1 font-medium text-slate-600">{order.customerType}</span>
                </div>
                <div>
                  <span className="text-slate-400">Date:</span>
                  <span className="ml-1 font-medium text-slate-600">{order.orderDate}</span>
                </div>
                <div>
                  <span className="text-slate-400">State:</span>
                  <span className="ml-1 font-medium text-slate-600">{order.state}</span>
                </div>
                <div>
                  <span className="text-slate-400">Amount:</span>
                  <span className="ml-1 font-medium text-slate-600">{order.prize}</span>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-50">
                <button className="text-slate-400 hover:text-slate-900 transition-colors">
                  <Pencil size={16} strokeWidth={2.5} />
                </button>
                <button className="text-slate-400 hover:text-red-600 transition-colors">
                  <Trash2 size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          ))}
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
              {orders.map((order, index) => (
                <tr key={index} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-4 text-xs font-medium text-slate-600">{order.orderId}</td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-400">{order.customerId}</td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-400">{order.city}</td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-400">{order.customerType}</td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-400 font-mono tracking-tighter">{order.orderDate}</td>
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
                      <button className="text-slate-400 hover:text-slate-900 transition-colors">
                        <Pencil size={16} strokeWidth={2.5} />
                      </button>
                      <button className="text-slate-400 hover:text-red-600 transition-colors">
                        <Trash2 size={16} strokeWidth={2.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
    </div>
  );
};

export default OrdersTable;
