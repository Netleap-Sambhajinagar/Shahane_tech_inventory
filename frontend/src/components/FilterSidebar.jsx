import React from 'react';

const FilterSidebar = ({ activeFilters, onToggle }) => {
  const categories = [
    '250 ML',
    '375 ML',
    '500 ML',
    '600 ML',
    '≥750 ML',
  ];

  return (
    <aside className="w-64 p-8 border-r border-slate-100 min-h-[calc(100vh-80px)] hidden md:block stick top-24">
      <div className="mb-8">
        <p className="text-slate-900 font-bold mb-8 text-xl">Home &gt; Shop</p>
        <h2 className="text-2xl font-bold text-slate-900 border-t border-slate-200 pt-6 mt-6">Filter:</h2>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Category</h3>
        <div className="flex flex-col gap-3">
          {categories.map((cat, index) => (
            <label key={index} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={activeFilters.includes(cat)}
                onChange={() => onToggle(cat)}
                className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
              />
              <span className={`text-sm font-medium transition-colors ${activeFilters.includes(cat) ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`}>
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
