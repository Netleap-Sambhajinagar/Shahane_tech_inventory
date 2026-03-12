import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, Pencil, Trash2, ChevronRight } from 'lucide-react';

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, []);

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
          Add New Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Product Name</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Product_ID</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Size</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Packaging_Quantity</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Purchase_Price</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Quantity_Sold</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Current_Stock</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Restock_Priority</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product, index) => (
              <tr key={index} className="hover:bg-slate-50/30 transition-colors">
                <td className="px-6 py-4 text-xs font-medium text-slate-600">{product.name}</td>
                <td className="px-6 py-4 text-xs font-medium text-slate-400">{product.id}</td>
                <td className="px-6 py-4 text-xs font-medium text-slate-400">{product.size}</td>
                <td className="px-6 py-4 text-xs font-medium text-slate-400 font-mono tracking-tighter">{product.quantity}</td>
                <td className="px-6 py-4 text-xs font-medium text-slate-400 font-mono tracking-tighter">{product.price}</td>
                <td className="px-6 py-4 text-xs font-medium text-slate-400 font-mono tracking-tighter">{product.sold}</td>
                <td className="px-6 py-4 text-xs font-medium text-slate-400 font-mono tracking-tighter">{product.stock}</td>
                <td className="px-6 py-4 text-xs font-medium text-slate-400">{product.priority}</td>
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

export default ProductTable;
