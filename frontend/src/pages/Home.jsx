import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import BOX_IMAGE from '../assets/product_box.png';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        const mappedData = data.map(p => ({
          id: p.id,
          product_id: p.product_id, // Add product_id for cart functionality
          name: p.name,
          size: p.size,
          price: p.purchase_price,
          oldPrice: p.old_price,
          minOrder: p.min_order,
          deliveryDate: p.delivery_date,
          image: p.image_url || BOX_IMAGE
        }));
        setProducts(mappedData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, []);

  const toggleFilter = (cat) => {
    setActiveFilters(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const filteredProducts = activeFilters.length > 0
    ? products.filter(p => activeFilters.includes(p.size))
    : products;

  return (
    <div className="flex">
      <FilterSidebar activeFilters={activeFilters} onToggle={toggleFilter} />
      <main className="flex-1 p-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-8">
          {activeFilters.length > 0 ? `Results for ${activeFilters.join(', ')}:` : 'All Results:'}
        </h2>
        
        {loading ? (
          <div className="text-center py-10 font-bold text-slate-400">Loading products...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-span-full text-center py-10 text-slate-400 font-medium">
                No products found matching the selected filters.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
