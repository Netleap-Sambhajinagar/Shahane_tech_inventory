import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import BOX_IMAGE from '../assets/product_box.png';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        // Map backend product data to match frontend component expectations if necessary
        const mappedData = data.map(p => ({
          id: p.id,
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

  return (
    <div className="flex">
      <FilterSidebar />
      <main className="flex-1 p-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-8">Results:</h2>
        
        {loading ? (
          <div className="text-center py-10">Loading products...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
