
"use client";
import { useState } from 'react';
import { CATEGORIES } from '../utils/constants';

export default function CategoryFilter({ onFilterChange }) {
  const [activeCategory, setActiveCategory] = useState('all');
  
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    onFilterChange(category);
  };
  
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        onClick={() => handleCategoryChange('all')}
        className={`px-3 py-1 rounded-full text-sm ${
          activeCategory === 'all' 
            ? 'bg-gray-800 text-white' 
            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
        }`}
      >
        All
      </button>
      
      {Object.entries(CATEGORIES).map(([key, { label, lightBg, textColor }]) => (
        <button
          key={key}
          onClick={() => handleCategoryChange(key)}
          className={`px-3 py-1 rounded-full text-sm ${
            activeCategory === key
              ? CATEGORIES[key].color + ' text-white'
              : CATEGORIES[key].lightBg + ' ' + CATEGORIES[key].textColor + ' hover:opacity-80'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}