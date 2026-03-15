import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, Pencil, Trash2, ChevronRight } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { notifications } = useNotifications();

  const fetchOrders = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/orders')
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching orders:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Refresh orders when new order notification is received
  useEffect(() => {
    const newOrderNotifications = notifications.filter(n => n.type === 'new_order' && !n.processed);
    if (newOrderNotifications.length > 0) {
      fetchOrders();
      // Mark notifications as processed
      newOrderNotifications.forEach(n => n.processed = true);
    }
  }, [notifications]);

  return (
    <div className="px-8 flex-1">
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-3">
          <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
            <SlidersHorizontal size={18} />
          </button>
          <button className="px-5 py-1.5 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-600 hover:bg-slate-50">
            Size
          </button>
          <button className="px-5 py-1.5 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-600 hover:bg-slate-50">
            Price
          </button>
        </div>
        <button className="px-6 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-bold shadow-lg hover:bg-slate-800 transition-colors uppercase tracking-tight">
          Add New Order
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
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

        <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
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
