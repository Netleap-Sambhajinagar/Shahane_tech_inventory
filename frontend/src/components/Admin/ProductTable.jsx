import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, Pencil, Trash2, ChevronRight, Plus, Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { makeAuthenticatedRequest } from '../../utils/auth';
import { getApiUrl } from '../../utils/api';
import AddProductModal from './AddProductModal';
import EditProductModal from './EditProductModal';

const ProductTable = ({ globalSearchTerm = '' }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    makeAuthenticatedRequest('/api/products')
      .then(data => {
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, []);

  // Filter products based on search term
  useEffect(() => {
    try {
      // Use global search term if provided, otherwise use local search term
      const currentSearchTerm = globalSearchTerm || searchTerm;
      console.log('Search term:', currentSearchTerm);
      console.log('Products count:', products.length);
      
      if (currentSearchTerm.trim() === '') {
        setFilteredProducts(products);
        console.log('Search cleared, showing all products');
      } else {
        const filtered = products.filter(product => {
          if (!product) return false;
          const name = (product.name || '').toString().toLowerCase();
          const productId = (product.product_id || '').toString().toLowerCase();
          const size = (product.size || '').toString().toLowerCase();
          const restockPriority = (product.restock_priority || '').toString().toLowerCase();
          const searchTermLower = currentSearchTerm.toLowerCase();
          
          return name.includes(searchTermLower) ||
                 productId.includes(searchTermLower) ||
                 size.includes(searchTermLower) ||
                 restockPriority.includes(searchTermLower);
        });
        console.log('Filtered products count:', filtered.length);
        setFilteredProducts(filtered);
      }
    } catch (error) {
      console.error('Error in search filtering:', error);
      setFilteredProducts(products);
    }
  }, [globalSearchTerm, searchTerm, products]);

  const handleProductAdded = (response) => {
    console.log('Product added:', response);
    // Refresh the products list
    makeAuthenticatedRequest('/api/products')
      .then(data => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch(err => {
        console.error('Error refreshing products:', err);
      });
  };

  // Handle delete product
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    
    try {
      const response = await makeAuthenticatedRequest(`/api/products/${productId}`, {
        method: 'DELETE'
      });
      
      // Remove product from local state
      setProducts(products.filter(product => product.id !== productId));
      
      console.log('Product deleted successfully:', productId);
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Failed to delete product. Please try again.');
    }
  };

  // Handle edit product
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  // Handle product updated
  const handleProductUpdated = (response) => {
    console.log('Product updated:', response);
    // Refresh the products list
    makeAuthenticatedRequest('/api/products')
      .then(data => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch(err => {
        console.error('Error refreshing products:', err);
      });
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    try {
      setSearchTerm(e.target.value);
    } catch (error) {
      console.error('Error in handleSearchChange:', error);
    }
  };

  // Sorting functions
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown size={14} className="w-3.5 h-3.5" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ArrowUp size={14} className="w-3.5 h-3.5" />
      : <ArrowDown size={14} className="w-3.5 h-3.5" />;
  };

  // Apply sorting to filtered products
  const sortedProducts = React.useMemo(() => {
    let sortableProducts = [...filteredProducts];
    
    if (sortConfig.key) {
      sortableProducts.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        // Handle numeric values for price
        if (sortConfig.key === 'purchase_price') {
          aValue = parseFloat(aValue) || 0;
          bValue = parseFloat(bValue) || 0;
        } else {
          // Handle text values for size and others
          aValue = aValue?.toString().toLowerCase() || '';
          bValue = bValue?.toString().toLowerCase() || '';
        }
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return sortableProducts;
  }, [filteredProducts, sortConfig]);

  // Display the current search term in empty state
  const displaySearchTerm = globalSearchTerm || searchTerm;

  return (
    <div className="px-2 sm:px-4 lg:px-8 flex-1">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-4">
        <div className="flex gap-2 sm:gap-3 flex-wrap">
          <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
            <SlidersHorizontal size={16} className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleSort('size')}
            className={`px-3 sm:px-5 py-1.5 border rounded-full text-xs sm:text-sm font-medium transition-colors flex items-center gap-1 ${
              sortConfig.key === 'size' 
                ? 'bg-blue-50 border-blue-200 text-blue-600' 
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Size
            {getSortIcon('size')}
          </button>
          <button 
            onClick={() => handleSort('purchase_price')}
            className={`px-3 sm:px-5 py-1.5 border rounded-full text-xs sm:text-sm font-medium transition-colors flex items-center gap-1 ${
              sortConfig.key === 'purchase_price' 
                ? 'bg-blue-50 border-blue-200 text-blue-600' 
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Price
            {getSortIcon('purchase_price')}
          </button>
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search products..."
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
        <button onClick={() => setIsAddModalOpen(true)} className="px-4 sm:px-6 py-2 sm:py-2.5 bg-slate-900 text-white rounded-lg text-xs sm:text-sm font-bold shadow-lg hover:bg-slate-800 transition-colors uppercase tracking-tight whitespace-nowrap flex items-center gap-2">
          <Plus size={16} className="w-4 h-4" />
          Add New Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Mobile Card View */}
        <div className="lg:hidden">
          {sortedProducts.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <Search size={48} className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p className="text-lg font-medium mb-2">No products found</p>
              <p className="text-sm">No products found matching "{displaySearchTerm}"</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  // Also clear global search if possible
                  if (globalSearchTerm) {
                    // This will be handled by the parent component
                  }
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Clear Search
              </button>
            </div>
          ) : (
            sortedProducts.map((product, index) => (
            <div key={index} className="p-4 border-b border-slate-100 last:border-b-0">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium text-slate-900 text-sm">{product.name}</h3>
                <span className="text-xs text-slate-400 font-mono">#{product.product_id}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400">Size:</span>
                  <span className="ml-1 font-medium text-slate-600">{product.size}</span>
                </div>
                <div>
                  <span className="text-slate-400">Packaging Qty:</span>
                  <span className="ml-1 font-medium text-slate-600">{product.packaging_quantity}</span>
                </div>
                <div>
                  <span className="text-slate-400">Purchase Price:</span>
                  <span className="ml-1 font-medium text-slate-600">{product.purchase_price}</span>
                </div>
                <div>
                  <span className="text-slate-400">Quantity Sold:</span>
                  <span className="ml-1 font-medium text-slate-600">{product.quantity_sold}</span>
                </div>
                <div>
                  <span className="text-slate-400">Current Stock:</span>
                  <span className="ml-1 font-medium text-slate-600">{product.current_stock}</span>
                </div>
                <div>
                  <span className="text-slate-400">Restock Priority:</span>
                  <span className="ml-1 font-medium text-slate-600">{product.restock_priority}</span>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-50">
                <button 
                  onClick={() => handleEditProduct(product)}
                  className="text-slate-400 hover:text-slate-900 transition-colors"
                  title="Edit Product"
                >
                  <Pencil size={16} strokeWidth={2.5} />
                </button>
                <button 
                  onClick={() => handleDeleteProduct(product.id)}
                  className="text-slate-400 hover:text-red-600 transition-colors"
                  title="Delete Product"
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
              {sortedProducts.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-12">
                    <div className="text-center">
                      <Search size={48} className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                      <p className="text-lg font-medium text-slate-600 mb-2">No products found</p>
                      <p className="text-sm text-slate-400 mb-4">No products found matching "{displaySearchTerm}"</p>
                      <button 
                        onClick={() => {
                          setSearchTerm('');
                          // Also clear global search if possible
                          if (globalSearchTerm) {
                            // This will be handled by the parent component
                          }
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Clear Search
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedProducts.map((product, index) => (
                <tr key={index} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-4 text-xs font-medium text-slate-600">{product.name}</td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-400">{product.product_id}</td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-400">{product.size}</td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-400 font-mono tracking-tighter">{product.packaging_quantity}</td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-400 font-mono tracking-tighter">{product.purchase_price}</td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-400 font-mono tracking-tighter">{product.quantity_sold}</td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-400 font-mono tracking-tighter">{product.current_stock}</td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-400">{product.restock_priority}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-4">
                      <button 
                        onClick={() => handleEditProduct(product)}
                        className="text-slate-400 hover:text-slate-900 transition-colors"
                        title="Edit Product"
                      >
                        <Pencil size={16} strokeWidth={2.5} />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-slate-400 hover:text-red-600 transition-colors"
                        title="Delete Product"
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

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProductAdded={handleProductAdded}
      />

      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onProductUpdated={handleProductUpdated}
        product={selectedProduct}
      />

      <div className="h-10"></div>
    </div>
  );
};

export default ProductTable;
