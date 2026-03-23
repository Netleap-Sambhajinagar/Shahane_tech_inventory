import React, { useState } from 'react';
import { X, Package, DollarSign, Calendar, Box, Upload, Image as ImageIcon } from 'lucide-react';
import { makeAuthenticatedRequest } from '../../utils/auth';
import { getApiUrl } from '../../utils/api';

const AddProductModal = ({ isOpen, onClose, onProductAdded }) => {
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
    current_stock: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedMainImage, setSelectedMainImage] = useState(null);
  const [selectedThumbnailImages, setSelectedThumbnailImages] = useState([]);
  const [mainImagePreview, setMainImagePreview] = useState('');
  const [thumbnailImagePreviews, setThumbnailImagePreviews] = useState([]);

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
      
      // Add to existing images array (main image first)
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
      
      // Add thumbnail images to existing array (after main image)
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
      const response = await makeAuthenticatedRequest('/api/products', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      if (response) {
        onProductAdded(response);
        onClose();
        // Reset form
        setFormData({
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
          current_stock: ''
        });
        setSelectedMainImage(null);
        setSelectedThumbnailImages([]);
        setMainImagePreview('');
        setThumbnailImagePreviews([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 relative animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-slate-900 rounded-xl text-white">
            <Package size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Add New Product</h2>
            <p className="text-sm text-slate-500">Enter product details below</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Product ID
                </label>
                <input
                  type="text"
                  name="product_id"
                  value={formData.product_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., P001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Hinged Box"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Size
                </label>
                <input
                  type="text"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 250ml"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Packaging Quantity
                </label>
                <input
                  type="number"
                  name="packaging_quantity"
                  value={formData.packaging_quantity}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 1000"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Purchase Price
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 text-slate-400" size={20} />
                  <input
                    type="number"
                    step="0.01"
                    name="purchase_price"
                    value={formData.purchase_price}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Old Price
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 text-slate-400" size={20} />
                  <input
                    type="number"
                    step="0.01"
                    name="old_price"
                    value={formData.old_price}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Minimum Order
                </label>
                <input
                  type="number"
                  name="min_order"
                  value={formData.min_order}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Delivery Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 text-slate-400" size={20} />
                  <input
                    type="text"
                    name="delivery_date"
                    value={formData.delivery_date}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., thu, 29 jan"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Current Stock
                </label>
                <input
                  type="number"
                  name="current_stock"
                  value={formData.current_stock}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 5000"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
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
                        {formData.images.length === 0 && (
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
                                Upload Main Image
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <ImageIcon size={48} className="mx-auto text-slate-400" />
                      <p className="text-sm text-slate-600">Click to select main product image</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleMainImageSelect}
                        className="hidden"
                        id="main-image-upload"
                      />
                      <label
                        htmlFor="main-image-upload"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm"
                      >
                        <Upload size={16} />
                        Choose Main Image
                      </label>
                      <p className="text-xs text-slate-500">PNG, JPG, GIF up to 5MB</p>
                    </div>
                  )}
                </div>
                
                {/* Show uploaded main image URL */}
                {formData.images.length > 0 && formData.images[0] && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700">
                      ✓ Main image uploaded successfully
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
                  {thumbnailImagePreviews.length > 0 ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-4 gap-3">
                        {thumbnailImagePreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img 
                              src={preview} 
                              alt={`Thumbnail preview ${index + 1}`} 
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
                        <button
                          type="button"
                          onClick={clearAllThumbnailImages}
                          className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                        >
                          Clear All
                        </button>
                        {formData.images.length <= 1 && (
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
                                Upload Thumbnails
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <ImageIcon size={48} className="mx-auto text-slate-400" />
                      <p className="text-sm text-slate-600">Click to select thumbnail images (max 4)</p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleThumbnailImagesSelect}
                        className="hidden"
                        id="thumbnail-images-upload"
                      />
                      <label
                        htmlFor="thumbnail-images-upload"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm"
                      >
                        <Upload size={16} />
                        Choose Thumbnail Images
                      </label>
                      <p className="text-xs text-slate-500">PNG, JPG, GIF up to 5MB each</p>
                    </div>
                  )}
                </div>
                
                {/* Show uploaded thumbnail image URLs */}
                {formData.images.length > 1 && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700">
                      ✓ {formData.images.length - 1} thumbnail image(s) uploaded successfully
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter product description..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin"></div>
                  Adding Product...
                </>
              ) : (
                <>
                  <Box size={20} />
                  Add Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
