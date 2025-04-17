
"use client";
import { CATEGORIES } from '../utils/constants';

export default function CategoryTag({ category }) {
  const categoryInfo = CATEGORIES[category] || {
    label: category,
    color: 'bg-gray-500',
    textColor: 'text-gray-500',
    lightBg: 'bg-gray-100'
  };
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryInfo.lightBg} ${categoryInfo.textColor}`}>
      {categoryInfo.label}
    </span>
  );
}