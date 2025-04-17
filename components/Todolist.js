"use client";
import { useState, useEffect } from 'react';
import TaskForm from '/TaskForm';
import TaskItem from '/TaskItem';
import CategoryFilter from '/CategoryFilter';

export default function TodoList() {
  const [tasks, setTasks] = useState([
    // Enhanced initial tasks with new properties
    { 
      id: '1', 
      title: 'Learn Next.js', 
      completed: false, 
      category: 'work',
      priority: 'high',
      dueDate: '2024-07-15'
    },
    { 
      id: '2', 
      title: 'Buy groceries', 
      completed: false, 
      category: 'shopping',
      priority: 'medium',
      dueDate: '2024-06-20'
    },
  ]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [activeFilter, setActiveFilter] = useState({
    category: 'all',
    status: 'all',
    priority: 'all',
    sortBy: 'dueDate' // 'dueDate', 'priority', 'creation'
  });
  
  // Add task handler (updated to include new fields)
  const addTask = (newTask) => {
    setTasks([...tasks, {
      ...newTask,
      id: Date.now().toString(),
      completed: false,
      priority: newTask.priority || 'medium',
      dueDate: newTask.dueDate || ''
    }]);
  };
  
  // Toggle complete handler (unchanged)
  const toggleComplete = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };
  
  // Delete task handler (unchanged)
  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };
  
  // Enhanced filter change handler
  const handleFilterChange = (filterType, value) => {
    setActiveFilter(prev => ({
      ...prev,
      [filterType]: value
    }));
  };
  
  // Filter and sort tasks when dependencies change
  useEffect(() => {
    let result = [...tasks];
    
    // Apply category filter
    if (activeFilter.category !== 'all') {
      result = result.filter(task => task.category === activeFilter.category);
    }
    
    // Apply status filter
    if (activeFilter.status !== 'all') {
      result = result.filter(task => 
        activeFilter.status === 'completed' ? task.completed : !task.completed
      );
    }
    
    // Apply priority filter
    if (activeFilter.priority !== 'all') {
      result = result.filter(task => task.priority === activeFilter.priority);
    }
    
    // Apply sorting
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    switch (activeFilter.sortBy) {
      case 'dueDate':
        result.sort((a, b) => 
          new Date(a.dueDate || '9999-12-31') - new Date(b.dueDate || '9999-12-31')
        );
        break;
      case 'priority':
        result.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        break;
      case 'creation':
      default:
        result.sort((a, b) => parseInt(a.id) - parseInt(b.id));
    }
    
    setFilteredTasks(result);
  }, [tasks, activeFilter]);
  
  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Todo List</h1>
      
      <TaskForm onAddTask={addTask} />
      
      {/* Existing Category Filter */}
      <CategoryFilter onFilterChange={(category) => handleFilterChange('category', category)} />
      
      {/* New Filter Controls */}
      <div className="flex flex-wrap gap-3 mb-6 p-4 bg-gray-100 rounded">
        {/* Status Filter */}
        <select
          value={activeFilter.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="active">Active</option>
        </select>
        
        {/* Priority Filter */}
        <select
          value={activeFilter.priority}
          onChange={(e) => handleFilterChange('priority', e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        
        {/* Sort By */}
        <select
          value={activeFilter.sortBy}
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          className="p-2 border rounded"
        >
          <option value="dueDate">Sort by Due Date</option>
          <option value="priority">Sort by Priority</option>
          <option value="creation">Sort by Creation</option>
        </select>
      </div>
      
      <div>
        {filteredTasks.length === 0 ? (
          <p className="text-gray-500 text-center">No tasks found</p>
        ) : (
          filteredTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={toggleComplete}
              onDelete={deleteTask}
            />
          ))
        )}
      </div>
    </div>
  );
}