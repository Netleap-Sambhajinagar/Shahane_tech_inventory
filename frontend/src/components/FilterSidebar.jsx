import React from 'react';

const FilterSidebar = () => {
  const categories = [
    { label: '250 ML', checked: true },
    { label: '375 ML', checked: false },
    { label: '500 ML', checked: false },
    { label: '600 ML', checked: false },
    { label: '≥750 ML', checked: false },
  ];

  return (
    <aside className="w-64 p-8 border-r border-slate-100 min-h-[calc(100vh-80px)]">
      <div className="mb-8">
        <p className="text-slate-900 font-bold mb-8 text-xl">Home &gt; 250 ML</p>
        <h2 className="text-2xl font-bold text-slate-900 border-t border-slate-200 pt-6 mt-6">Filter:</h2>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Category</h3>
        <div className="flex flex-col gap-3">
          {categories.map((cat, index) => (
            <label key={index} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={cat.checked}
                onChange={() => {}}
                className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <span className={`text-sm font-medium transition-colors ${cat.checked ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`}>
                {cat.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
