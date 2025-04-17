
"use client";
import { CATEGORIES } from '../utils/constants';
import CategoryTag from './CategoryTag';

export default function TaskItem({ task, onToggleComplete, onDelete }) {
  const categoryStyle = task.category ? 
    `border-l-4 ${CATEGORIES[task.category]?.borderColor || 'border-gray-300'}` : '';
  
  return (
    <div className={`flex items-center justify-between p-4 border rounded-lg shadow-sm mb-2 hover:shadow-md transition-shadow ${categoryStyle}`}>
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task.id)}
          className="h-5 w-5 rounded border-gray-300"
        />
        <span className={`${task.completed ? 'line-through text-gray-500' : ''}`}>
          {task.title}
        </span>
        {task.category && <CategoryTag category={task.category} />}
      </div>
      
      <button
        onClick={() => onDelete(task.id)}
        className="text-gray-500 hover:text-red-500"
      >
        Delete
      </button>
    </div>
  );
}