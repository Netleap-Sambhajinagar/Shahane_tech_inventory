import React, { useState, useEffect } from 'react';
import { X, Package, DollarSign, Calendar, Box, Upload, Image as ImageIcon } from 'lucide-react';
import { makeAuthenticatedRequest } from '../../utils/auth';
import { getApiUrl } from '../../utils/api';

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
    images: [],
    description: '',
    current_stock: '',
    quantity_sold: '',
    restock_priority: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedMainImage, setSelectedMainImage] = useState(null);
  const [selectedThumbnailImages, setSelectedThumbnailImages] = useState([]);
  const [mainImagePreview, setMainImagePreview] = useState('');
  const [thumbnailImagePreviews, setThumbnailImagePreviews] = useState([]);

  useEffect(() => {
    if (product && isOpen) {
      const parsedImages = product.images ? (typeof product.images === 'string' ? JSON.parse(product.images) : product.images) : [];
      setFormData({
        product_id: product.product_id || '',
        name: product.name || '',
        size: product.size || '',
        packaging_quantity: product.packaging_quantity || '',
        purchase_price: product.purchase_price || '',
        old_price: product.old_price || '',
        min_order: product.min_order || '',
        delivery_date: product.delivery_date || '',
        images: parsedImages,
        description: product.description || '',
        current_stock: product.current_stock || '',
        quantity_sold: product.quantity_sold || '',
        restock_priority: product.restock_priority || ''
      });
      
      // Set existing image previews
      if (parsedImages.length > 0) {
        setMainImagePreview(parsedImages[0] || '');
        setThumbnailImagePreviews(parsedImages.slice(1));
      }
    }
  }, [product, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMainImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file
    if (!file.type.startsWith('image/')) {
      setError('Please select only an image file for main image');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setError('Main image size should be less than 5MB');
      return;
    }
    
    setSelectedMainImage(file);
    setMainImagePreview(URL.createObjectURL(file));
    setError('');
  };

  const handleThumbnailImagesSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    // Validate each file
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        setError('Please select only image files for thumbnails');
        return false;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError('Thumbnail image size should be less than 5MB');
        return false;
      }
      
      return true;
    });
    
    if (validFiles.length === 0) return;
    
    // Limit to 4 thumbnail images
    const limitedFiles = validFiles.slice(0, 4);
    
    setSelectedThumbnailImages(prev => [...prev, ...limitedFiles]);
    
    // Create previews
    const newPreviews = limitedFiles.map(file => URL.createObjectURL(file));
    setThumbnailImagePreviews(prev => [...prev, ...newPreviews]);
    setError('');
  };

  const handleMainImageUpload = async () => {
    if (!selectedMainImage) {
      setError('Please select a main image');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('images', selectedMainImage);

      const response = await fetch(getApiUrl('/api/products/upload'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload main image');
      }

      const result = await response.json();
      
      // Update main image in existing images array
      setFormData(prev => ({
        ...prev,
        images: [result.imageUrls[0], ...prev.images.slice(1)]
      }));
      
      setUploading(false);
    } catch (err) {
      setError(err.message || 'Failed to upload main image');
      setUploading(false);
    }
  };

  const handleThumbnailImagesUpload = async () => {
    if (selectedThumbnailImages.length === 0) {
      setError('Please select at least one thumbnail image');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      selectedThumbnailImages.forEach((image, index) => {
        formData.append('images', image);
      });

      const response = await fetch(getApiUrl('/api/products/upload'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload thumbnail images');
      }

      const result = await response.json();
      
      // Update thumbnail images in existing array
      setFormData(prev => ({
        ...prev,
        images: [prev.images[0] || '', ...result.imageUrls]
      }));
      
      setUploading(false);
    } catch (err) {
      setError(err.message || 'Failed to upload thumbnail images');
      setUploading(false);
    }
  };

  const removeThumbnailImage = (index) => {
    setSelectedThumbnailImages(prev => prev.filter((_, i) => i !== index));
    setThumbnailImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const clearMainImage = () => {
    setSelectedMainImage(null);
    setMainImagePreview('');
    setFormData(prev => ({
      ...prev,
      images: ['', ...prev.images.slice(1)]
    }));
  };

  const clearAllThumbnailImages = () => {
    setSelectedThumbnailImages([]);
    setThumbnailImagePreviews([]);
    setFormData(prev => ({
      ...prev,
      images: [prev.images[0] || '']
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await makeAuthenticatedRequest(`/api/products/${product.id}`, {
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
          </div>

          {/* Image Management Section */}
          <div className="mt-6 space-y-6">
            <h3 className="text-lg font-semibold text-slate-900">Product Images</h3>
            
            {/* Main Image Section */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Main Product Image
              </label>
              <div className="space-y-3">
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                  {mainImagePreview ? (
                    <div className="space-y-3">
                      <div className="flex justify-center">
                        <div className="relative group">
                          <img 
                            src={mainImagePreview} 
                            alt="Main product preview" 
                            className="h-32 w-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={clearMainImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-center gap-2">
                        {selectedMainImage && (
                          <button
                            type="button"
                            onClick={handleMainImageUpload}
                            disabled={uploading}
                            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2"
                          >
                            {uploading ? (
                              <>
                                <div className="w-3 h-3 border-2 border-white border-t-transparent animate-spin"></div>
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload size={16} />
                                Upload New Main Image
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <ImageIcon size={48} className="mx-auto text-slate-400" />
                      <p className="text-sm text-slate-600">Click to select new main product image</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleMainImageSelect}
                        className="hidden"
                        id="edit-main-image-upload"
                      />
                      <label
                        htmlFor="edit-main-image-upload"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm"
                      >
                        <Upload size={16} />
                        Choose New Main Image
                      </label>
                      <p className="text-xs text-slate-500">PNG, JPG, GIF up to 5MB</p>
                    </div>
                  )}
                </div>
                
                {/* Show current main image URL */}
                {formData.images.length > 0 && formData.images[0] && !selectedMainImage && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700">
                      Current main image: {formData.images[0]}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Images Section */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Thumbnail Images (Optional)
              </label>
              <div className="space-y-3">
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                  {thumbnailImagePreviews.length > 0 || (formData.images.length > 1 && !selectedThumbnailImages.length) ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-4 gap-3">
                        {/* Show existing thumbnails */}
                        {(formData.images.length > 1 ? formData.images.slice(1) : []).map((url, index) => (
                          <div key={`existing-${index}`} className="relative group">
                            <img 
                              src={url} 
                              alt={`Existing thumbnail ${index + 1}`} 
                              className="h-16 w-16 object-cover rounded-lg"
                            />
                          </div>
                        ))}
                        {/* Show new thumbnail previews */}
                        {thumbnailImagePreviews.map((preview, index) => (
                          <div key={`new-${index}`} className="relative group">
                            <img 
                              src={preview} 
                              alt={`New thumbnail preview ${index + 1}`} 
                              className="h-16 w-16 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeThumbnailImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-center gap-2">
                        {selectedThumbnailImages.length > 0 && (
                          <button
                            type="button"
                            onClick={handleThumbnailImagesUpload}
                            disabled={uploading}
                            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2"
                          >
                            {uploading ? (
                              <>
                                <div className="w-3 h-3 border-2 border-white border-t-transparent animate-spin"></div>
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload size={16} />
                                Upload New Thumbnails
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <ImageIcon size={48} className="mx-auto text-slate-400" />
                      <p className="text-sm text-slate-600">Click to select new thumbnail images (max 4)</p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleThumbnailImagesSelect}
                        className="hidden"
                        id="edit-thumbnail-images-upload"
                      />
                      <label
                        htmlFor="edit-thumbnail-images-upload"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm"
                      >
                        <Upload size={16} />
                        Choose New Thumbnail Images
                      </label>
                      <p className="text-xs text-slate-500">PNG, JPG, GIF up to 5MB each</p>
                    </div>
                  )}
                </div>
                
                {/* Show current thumbnail image URLs */}
                {formData.images.length > 1 && !selectedThumbnailImages.length && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700">
                      Current thumbnails: {formData.images.length - 1} image(s)
                    </p>
                  </div>
                )}
              </div>
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
