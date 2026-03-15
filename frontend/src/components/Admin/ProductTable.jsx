import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, Pencil, Trash2, ChevronRight, Plus } from 'lucide-react';
import { makeAuthenticatedRequest } from '../../utils/auth';
import AddProductModal from './AddProductModal';

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    makeAuthenticatedRequest('http://localhost:5000/api/products')
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, []);

  const handleProductAdded = (response) => {
    console.log('Product added:', response);
    // Refresh the products list
    makeAuthenticatedRequest('http://localhost:5000/api/products')
      .then(data => {
        setProducts(data);
      })
      .catch(err => {
        console.error('Error refreshing products:', err);
      });
  };

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
        <button onClick={() => setIsAddModalOpen(true)} className="px-4 sm:px-6 py-2 sm:py-2.5 bg-slate-900 text-white rounded-lg text-xs sm:text-sm font-bold shadow-lg hover:bg-slate-800 transition-colors uppercase tracking-tight whitespace-nowrap flex items-center gap-2">
          <Plus size={16} className="w-4 h-4" />
          Add New Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Mobile Card View */}
        <div className="lg:hidden">
          {products.map((product, index) => (
            <div key={index} className="p-4 border-b border-slate-100 last:border-b-0">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium text-slate-900 text-sm">{product.name}</h3>
                <span className="text-xs text-slate-400 font-mono">#{product.id}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400">Size:</span>
                  <span className="ml-1 font-medium text-slate-600">{product.size}</span>
                </div>
                <div>
                  <span className="text-slate-400">Qty:</span>
                  <span className="ml-1 font-medium text-slate-600">{product.quantity}</span>
                </div>
                <div>
                  <span className="text-slate-400">Price:</span>
                  <span className="ml-1 font-medium text-slate-600">{product.price}</span>
                </div>
                <div>
                  <span className="text-slate-400">Stock:</span>
                  <span className="ml-1 font-medium text-slate-600">{product.stock}</span>
                </div>
              </div>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-50">
                <span className="text-xs text-slate-400">{product.priority}</span>
                <div className="flex gap-3">
                  <button className="text-slate-400 hover:text-slate-900 transition-colors">
                    <Pencil size={16} strokeWidth={2.5} />
                  </button>
                  <button className="text-slate-400 hover:text-red-600 transition-colors">
                    <Trash2 size={16} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
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

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProductAdded={handleProductAdded}
      />

      <div className="h-10"></div>
    </div>
  );
};

export default ProductTable;
