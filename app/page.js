"use client";
import React, { useState, useEffect } from 'react';
import { CATEGORIES, PRIORITIES } from '../utils/constants';
import CategoryTag from '../components/CategoryTag';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import ThemeToggle from '../components/Themetoggle';
import ProtectedRoute from '../components/protected route';
import { useAuth } from '../context/authcontext';
import { useRouter } from 'next/navigation';

const Page = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [descp, setDescp] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [maintask, setMaintask] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [completionFilter, setCompletionFilter] = useState("all");
  const [filteredTasks, setFilteredTasks] = useState([]);

  // Load tasks from localStorage with user-specific key
  useEffect(() => {
    if (user) {
      const savedTasks = localStorage.getItem(`tasks_${user.uid}`);
      if (savedTasks) {
        setMaintask(JSON.parse(savedTasks));
      }
    }
  }, [user]);

  // Save tasks to localStorage with user-specific key
  useEffect(() => {
    if (user) {
      localStorage.setItem(`tasks_${user.uid}`, JSON.stringify(maintask));
    }
  }, [maintask, user]);

  // Filter tasks based on active filters
  useEffect(() => {
    const filtered = maintask.filter(task => {
      const categoryMatch = activeFilter === 'all' || task.category === activeFilter;
      const priorityMatch = priorityFilter === 'all' || task.priority === priorityFilter;
      const completionMatch = completionFilter === 'all' || 
        (completionFilter === 'completed' && task.isCompleted) || 
        (completionFilter === 'incomplete' && !task.isCompleted);
      
      return categoryMatch && priorityMatch && completionMatch;
    });
    setFilteredTasks(filtered);
  }, [maintask, activeFilter, priorityFilter, completionFilter]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (title.trim() === "" || descp.trim() === "" || category === "" || priority === "") return;
  
    const newTask = {
      id: `task-${Date.now()}`,
      title,
      descp,
      category,
      priority,
      isCompleted: false,
      userId: user.uid  // Add user ID to the task
    };
  
    setMaintask(prev => [...prev, newTask]);
    setTitle("");
    setDescp("");
    setCategory("");
    setPriority("");
  };

  const handleFilterChange = (categoryKey) => {
    setActiveFilter(categoryKey);
  };

  const toggleComplete = (taskId) => {
    setMaintask(prev => prev.map(task => 
      task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
    ));
  };

  const deleteHandler = (taskId) => {
    setMaintask(prev => prev.filter(task => task.id !== taskId));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(filteredTasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setFilteredTasks(items);
    
    // Update main task list to persist order
    setMaintask(prev => {
      const newOrder = Array.from(prev);
      const taskId = items[result.destination.index].id;
      const taskIndex = prev.findIndex(t => t.id === taskId);
      const [movedTask] = newOrder.splice(taskIndex, 1);
      newOrder.splice(result.destination.index, 0, movedTask);
      return newOrder;
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen transition-colors duration-200">
        <header className="bg-indigo-600 dark:bg-indigo-900 shadow-lg py-6">
          <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
            <div className="flex-1">
              {user && (
                <p className="text-white">Welcome, {user.displayName || user.email}</p>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-center text-white">Frame</h1>
            <div className="flex-1 flex justify-end items-center gap-4">
              <ThemeToggle />
              <button
                onClick={handleLogout}
                className="bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Form Section */}
        <section className="max-w-4xl mx-auto mt-8 px-4">
          <form 
            className="rounded-lg shadow-xl p-6 mb-10" 
            onSubmit={submitHandler}
          >
            <div className="mb-6 space-y-4 md:space-y-0 md:flex md:gap-4 flex-wrap justify-between">
              <div className="md:w-1/3">
                <label htmlFor="title" className="block text-sm font-medium mb-2 ">Task Title</label>
                <input
                  id="title"
                  type="text"
                  className="w-full px-4 py-3 rounded-md text-black  dark:text-white dark:bg-gray-600 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 "
                  placeholder="Enter task title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="md:w-1/3">
                <label htmlFor="description" className="block text-sm font-medium mb-2 ">Description</label>
                <input
                  id="description"
                  type="text"
                  className="w-full px-4 py-3 rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 text-gray-800 dark:text-white"
                  placeholder="Enter task description"
                  value={descp}
                  onChange={(e) => setDescp(e.target.value)}
                  required
                />
              </div>

              <div className="md:w-1/3">
                <label htmlFor="category" className="block text-sm font-medium mb-2 ">Category</label>
                <select
                  id="category"
                  className="w-full px-4 py-3 rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 text-gray-800 dark:text-white"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select Category</option>
                  {Object.entries(CATEGORIES).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="md:w-1/3">
                <label htmlFor="priority" className="block text-sm font-medium mb-2 ">Priority</label>
                <select
                  id="priority"
                  className="w-full px-4 py-3 rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 text-gray-800 dark:text-white"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  required
                >
                  <option value="">Select Priority</option>
                  {Object.entries(PRIORITIES).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="text-center mt-4">
              <button 
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md font-semibold"
              >
                Add Task
              </button>
            </div>
          </form>
        </section>

        {/* Filters Section */}
        <section className="max-w-4xl mx-auto px-4 mb-6 space-y-4">
          <div className="rounded-lg shadow-xl p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-400">Filters</h3>
            
            {/* Category Filter */}
            <div>
              <h4 className="text-sm font-medium mb-2 text-gray-400">Category</h4>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => handleFilterChange('all')} 
                  className={`px-3 py-1 rounded-full text-sm ${activeFilter === 'all' ? 'bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'}`}
                >
                  All Categories
                </button>
                {Object.entries(CATEGORIES).map(([key, { label, color }]) => (
                  <button 
                    key={key} 
                    onClick={() => handleFilterChange(key)} 
                    className={`px-3 py-1 rounded-full text-sm ${activeFilter === key ? `${color} text-white` : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority Filter */}
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2 text-gray-400">Priority</h4>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setPriorityFilter('all')}
                  className={`px-3 py-1 rounded-full text-sm ${priorityFilter === 'all' ? 'bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'}`}
                >
                  All Priorities
                </button>
                {Object.entries(PRIORITIES).map(([key, label]) => (
                  <button 
                    key={key} 
                    onClick={() => setPriorityFilter(key)}
                    className={`px-3 py-1 rounded-full text-sm ${priorityFilter === key ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Completion Filter */}
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2 text-gray-400">Status</h4>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setCompletionFilter('all')}
                  className={`px-3 py-1 rounded-full text-sm ${completionFilter === 'all' ? 'bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'}`}
                >
                All Statuses
                </button>
                <button 
                  onClick={() => setCompletionFilter('completed')}
                  className={`px-3 py-1 rounded-full text-sm ${completionFilter === 'completed' ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'}`}
                >
                  Completed
                </button>
                <button 
                  onClick={() => setCompletionFilter('incomplete')}
                  className={`px-3 py-1 rounded-full text-sm ${completionFilter === 'incomplete' ? 'bg-yellow-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'}`}
                >
                  Incomplete
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Task List */}
        <section className="max-w-4xl mx-auto px-4 pb-16">
          <div className="rounded-lg shadow-xl p-6">
          <h2 className="text-4xl font-bold mb-6 text-center text-black dark:text-white">Your Tasks</h2>

            {filteredTasks.length === 0 ? (
              <div className="text-center py-10 text-gray-800 dark:text-gray-400">
                {maintask.length === 0 ? "No tasks added yet" : "No tasks match your filter"}
              </div>
            ) : (
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="tasks">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                      {filteredTasks.map((task, i) => {
                        const categoryStyle = task.category ? `border-l-4 ${CATEGORIES[task.category]?.borderColor || 'border-indigo-500'}` : "";
                        const priorityLabel = PRIORITIES[task.priority] || "";

                        return (
                          <Draggable key={task.id} draggableId={task.id} index={i}>
                            {(provided) => (
                              <div 
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${categoryStyle}`}
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <h3 className={`text-xl font-semibold ${task.isCompleted ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-white'}`}>
                                      {task.title}
                                    </h3>
                                    {task.category && <CategoryTag category={task.category} />}
                                  </div>
                                  <p className="text-gray-600 dark:text-gray-300 mt-1">{task.descp}</p>
                                  <p className="text-sm text-yellow-600 dark:text-yellow-300 mt-1">Priority: {priorityLabel}</p>
                                  <p className={`text-sm mt-1 ${task.isCompleted ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`}>
                                    Status: {task.isCompleted ? '✅ Completed' : '🕒 Incomplete'}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => toggleComplete(task.id)} 
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                                  >
                                    {task.isCompleted ? "Mark Incomplete" : "Mark Complete"}
                                  </button>
                                  <button 
                                    onClick={() => deleteHandler(task.id)} 
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>
        </section>
      </div>
    </ProtectedRoute>
  );
};

export default Page;