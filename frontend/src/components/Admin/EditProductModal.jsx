import React, { useState, useEffect } from 'react';
import { X, Package, DollarSign, Calendar, Box } from 'lucide-react';
import { makeAuthenticatedRequest } from '../../utils/auth';

const EditProductModal = ({ isOpen, onClose, onProductUpdated, product }) => {
  const [formData, setFormData] = useState({
    product_id: '',
    name: '',
    size: '',
    packaging_quantity: '',
    purchase_price: '',
    old_price: '',
    min_order: '',
    delivery_date: '',
    image_url: '',
    description: '',
    current_stock: '',
    quantity_sold: '',
    restock_priority: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product && isOpen) {
      setFormData({
        product_id: product.product_id || '',
        name: product.name || '',
        size: product.size || '',
        packaging_quantity: product.packaging_quantity || '',
        purchase_price: product.purchase_price || '',
        old_price: product.old_price || '',
        min_order: product.min_order || '',
        delivery_date: product.delivery_date || '',
        image_url: product.image_url || '',
        description: product.description || '',
        current_stock: product.current_stock || '',
        quantity_sold: product.quantity_sold || '',
        restock_priority: product.restock_priority || ''
      });
    }
  }, [product, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await makeAuthenticatedRequest(`http://localhost:5000/api/products/${product.id}`, {
        method: 'PUT',
        body: JSON.stringify(formData)
      });

      if (response) {
        onProductUpdated(response);
        onClose();
      }
    } catch (err) {
      setError('Failed to update product. Please try again.');
      console.error('Error updating product:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Edit Product</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Product ID */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Product ID
              </label>
              <input
                type="text"
                name="product_id"
                value={formData.product_id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Size */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Size
              </label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 250ml, 500g"
              />
            </div>

            {/* Packaging Quantity */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Packaging Quantity
              </label>
              <input
                type="number"
                name="packaging_quantity"
                value={formData.packaging_quantity}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Purchase Price */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Purchase Price
              </label>
              <input
                type="number"
                step="0.01"
                name="purchase_price"
                value={formData.purchase_price}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Old Price */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Old Price
              </label>
              <input
                type="number"
                step="0.01"
                name="old_price"
                value={formData.old_price}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Minimum Order */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Minimum Order Quantity
              </label>
              <input
                type="number"
                name="min_order"
                value={formData.min_order}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Delivery Date */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Delivery Date
              </label>
              <input
                type="text"
                name="delivery_date"
                value={formData.delivery_date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 2-3 business days"
              />
            </div>

            {/* Current Stock */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Current Stock
              </label>
              <input
                type="number"
                name="current_stock"
                value={formData.current_stock}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Quantity Sold */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Quantity Sold
              </label>
              <input
                type="number"
                name="quantity_sold"
                value={formData.quantity_sold}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Restock Priority */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Restock Priority
              </label>
              <input
                type="number"
                name="restock_priority"
                value={formData.restock_priority}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1-10 (1 = highest priority)"
              />
            </div>

            {/* Image URL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Image URL
              </label>
              <input
                type="text"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Product description..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
