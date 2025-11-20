import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { type Task, type TaskFilters, fetchTasks, createTask, updateTask, deleteTask, getGuestTasks, createGuestTask, updateGuestTask, deleteGuestTask } from '../api';
import { TaskCard } from '../components/TaskCard';
import { TaskForm } from '../components/TaskForm';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const { user, token, logout } = useAuth();
  const queryClient = useQueryClient();
  
  const [filters, setFilters] = useState<TaskFilters>({
    search: '',
    status: 'all',
    sortBy: 'createdAt',
    order: 'desc',
  });

  // React Query for authenticated users
  const { data: apiTasks = [], isLoading } = useQuery({
    queryKey: ['tasks', filters, token],
    queryFn: () => token ? fetchTasks(token, filters) : Promise.resolve([]),
    enabled: !!token,
  });

  // Guest mode state
  const [guestTasks, setGuestTasks] = useState<Task[]>([]);

  // Determine which tasks to display
  const tasks = token ? apiTasks : guestTasks;

  // Load guest tasks when filters change
  useState(() => {
    if (!token) {
      setGuestTasks(getGuestTasks(filters));
    }
  });

  // Mutations with optimistic updates
  const createMutation = useMutation({
    mutationFn: async (taskData: { title: string; description?: string }) => {
      if (token) {
        return createTask(token, taskData);
      } else {
        return createGuestTask(taskData);
      }
    },
    onMutate: async (newTask) => {
      if (token) {
        await queryClient.cancelQueries({ queryKey: ['tasks'] });
        const previousTasks = queryClient.getQueryData<Task[]>(['tasks', filters, token]);
        
        queryClient.setQueryData<Task[]>(['tasks', filters, token], (old = []) => [
          {
            id: Date.now(),
            ...newTask,
            description: newTask.description || null,
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          ...old,
        ]);
        
        return { previousTasks };
      } else {
        setGuestTasks(getGuestTasks(filters));
      }
    },
    onError: (err, newTask, context) => {
      if (token && context?.previousTasks) {
        queryClient.setQueryData(['tasks', filters, token], context.previousTasks);
      }
    },
    onSettled: () => {
      if (token) {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Task> }) => {
      if (token) {
        return updateTask(token, id, updates);
      } else {
        return updateGuestTask(id, updates);
      }
    },
    onMutate: async ({ id, updates }) => {
      if (token) {
        await queryClient.cancelQueries({ queryKey: ['tasks'] });
        const previousTasks = queryClient.getQueryData<Task[]>(['tasks', filters, token]);
        
        queryClient.setQueryData<Task[]>(['tasks', filters, token], (old = []) =>
          old.map(task => task.id === id ? { ...task, ...updates } : task)
        );
        
        return { previousTasks };
      } else {
        setGuestTasks(getGuestTasks(filters));
      }
    },
    onError: (err, variables, context) => {
      if (token && context?.previousTasks) {
        queryClient.setQueryData(['tasks', filters, token], context.previousTasks);
      }
    },
    onSettled: () => {
      if (token) {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      if (token) {
        return deleteTask(token, id);
      } else {
        return deleteGuestTask(id);
      }
    },
    onMutate: async (id) => {
      if (token) {
        await queryClient.cancelQueries({ queryKey: ['tasks'] });
        const previousTasks = queryClient.getQueryData<Task[]>(['tasks', filters, token]);
        
        queryClient.setQueryData<Task[]>(['tasks', filters, token], (old = []) =>
          old.filter(task => task.id !== id)
        );
        
        return { previousTasks };
      } else {
        setGuestTasks(getGuestTasks(filters));
      }
    },
    onError: (err, id, context) => {
      if (token && context?.previousTasks) {
        queryClient.setQueryData(['tasks', filters, token], context.previousTasks);
      }
    },
    onSettled: () => {
      if (token) {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      }
    },
  });

  const handleCreateTask = async (taskData: { title: string; description?: string }) => {
    createMutation.mutate(taskData);
  };

  const handleUpdateTask = async (id: number, updates: Partial<Task>) => {
    updateMutation.mutate({ id, updates });
  };

  const handleDeleteTask = async (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleFilterChange = (newFilters: Partial<TaskFilters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    if (!token) {
      setGuestTasks(getGuestTasks(updated));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Zodiac Task Manager
              </h1>
              <p className="text-gray-600 mt-2">
                {user ? `Welcome back, ${user.email}` : 'Guest Mode - Tasks saved locally'}
              </p>
            </div>
            <div className="flex gap-3">
              {user ? (
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
          {!user && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <p className="text-sm text-blue-700">
                💡 <strong>Tip:</strong> Sign up to save your tasks permanently across devices!
              </p>
            </div>
          )}
        </header>

        <TaskForm onTaskCreated={handleCreateTask} />

        {/* Search and Filters */}
        <div className="bg-white p-5 rounded-2xl shadow-lg border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">🔍 Search</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange({ search: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search tasks..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">📊 Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange({ status: e.target.value as any })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Tasks</option>
                <option value="active">Not Completed</option>
                <option value="completed">Done</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">🔄 Sort By</label>
              <select
                value={`${filters.sortBy}-${filters.order}`}
                onChange={(e) => {
                  const [sortBy, order] = e.target.value.split('-');
                  handleFilterChange({ sortBy: sortBy as any, order: order as any });
                }}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
                <option value="updatedAt-desc">Recently Updated</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="text-gray-500 mt-4">Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-md">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-500 text-lg">
              {filters.search || filters.status !== 'all' 
                ? 'No tasks match your filters' 
                : 'No tasks yet. Add one above to get started!'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Your Tasks ({tasks.length})
            </h2>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdate={handleUpdateTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
