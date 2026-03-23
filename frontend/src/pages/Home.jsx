import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import BOX_IMAGE from '../assets/product_box.png';

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const search = searchParams.get('search');
    if (search) {
      setSearchQuery(search);
      fetchSearchResults(search);
    } else {
      setSearchQuery('');
      fetchAllProducts();
    }
  }, [searchParams]);

  const fetchAllProducts = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        const mappedData = data.map(p => {
          // Handle new main_image field, fallback to old images field, then image_url
          let imageUrl = BOX_IMAGE;
          
          if (p.main_image) {
            // New format: use main_image field
            imageUrl = `${p.main_image}?t=${Date.now()}`;
          } else if (p.images) {
            // Backward compatibility: old images array format
            try {
              const imagesArray = JSON.parse(p.images);
              if (imagesArray.length > 0) {
                imageUrl = `${imagesArray[0]}?t=${Date.now()}`;
              }
            } catch (e) {
              // If JSON parsing fails, fallback to old field
              if (p.image_url) {
                imageUrl = `${p.image_url}?t=${Date.now()}`;
              }
            }
          } else if (p.image_url) {
            // Fallback to old image_url field
            imageUrl = `${p.image_url}?t=${Date.now()}`;
          }
          
          return {
            id: p.id,
            product_id: p.product_id,
            name: p.name,
            size: p.size,
            price: p.purchase_price,
            oldPrice: p.old_price,
            minOrder: p.min_order,
            deliveryDate: p.delivery_date,
            image: imageUrl
          };
        });
        setProducts(mappedData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  };

  const fetchSearchResults = (query) => {
    setLoading(true);
    fetch(`http://localhost:5000/api/products/search?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        const mappedData = data.map(p => {
          // Handle new main_image field, fallback to old images field, then image_url
          let imageUrl = BOX_IMAGE;
          
          if (p.main_image) {
            // New format: use main_image field
            imageUrl = `${p.main_image}?t=${Date.now()}`;
          } else if (p.images) {
            // Backward compatibility: old images array format
            try {
              const imagesArray = JSON.parse(p.images);
              if (imagesArray.length > 0) {
                imageUrl = `${imagesArray[0]}?t=${Date.now()}`;
              }
            } catch (e) {
              // If JSON parsing fails, fallback to old field
              if (p.image_url) {
                imageUrl = `${p.image_url}?t=${Date.now()}`;
              }
            }
          } else if (p.image_url) {
            // Fallback to old image_url field
            imageUrl = `${p.image_url}?t=${Date.now()}`;
          }
          
          return {
            id: p.id,
            product_id: p.product_id,
            name: p.name,
            size: p.size,
            price: p.purchase_price,
            oldPrice: p.old_price,
            minOrder: p.min_order,
            deliveryDate: p.delivery_date,
            image: imageUrl
          };
        });
        setProducts(mappedData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error searching products:', err);
        setLoading(false);
      });
  };

  const toggleFilter = (cat) => {
    setActiveFilters(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const clearSearch = () => {
    setSearchParams({});
  };

  const filteredProducts = activeFilters.length > 0
    ? products.filter(p => {
        const productSize = (p.size || '').toLowerCase();
        return activeFilters.some(filter => filter.toLowerCase() === productSize);
      })
    : products;

  return (
    <div className="flex">
      <FilterSidebar activeFilters={activeFilters} onToggle={toggleFilter} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-4">
          <button className="w-full py-2 px-4 bg-slate-100 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors">
            Filters ({activeFilters.length} active)
          </button>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {searchQuery ? (
              <>
                Search Results for "{searchQuery}":
                {filteredProducts.length > 0 && (
                  <span className="text-sm sm:text-lg font-normal text-slate-600 ml-2">
                    ({filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found)
                  </span>
                )}
              </>
            ) : activeFilters.length > 0 ? (
              `Results for ${activeFilters.join(', ')}:`
            ) : (
              'All Results:'
            )}
          </h2>
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="px-3 sm:px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Clear Search
            </button>
          )}
        </div>
        
        {loading ? (
          <div className="text-center py-10 font-bold text-slate-400">Loading products...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-span-full text-center py-10 text-slate-400 font-medium px-4">
                {searchQuery 
                  ? `No products found matching "${searchQuery}". Try different keywords.`
                  : 'No products found matching the selected filters.'
                }
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
