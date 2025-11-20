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
    page: 1,
    limit: 10,
  });

  // React Query for authenticated users
  const { data: apiData, isLoading } = useQuery({
    queryKey: ['tasks', filters, token],
    queryFn: () => token ? fetchTasks(token, filters) : Promise.resolve({ tasks: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } }),
    enabled: !!token,
  });

  // Guest mode state
  const [guestTasks, setGuestTasks] = useState<Task[]>([]);
  const [guestTotal, setGuestTotal] = useState(0);

  // Determine which tasks to display
  const tasks = token ? apiData?.tasks || [] : guestTasks;
  const pagination = token ? apiData?.pagination : {
    page: filters.page || 1,
    limit: filters.limit || 10,
    total: guestTotal,
    totalPages: Math.ceil(guestTotal / (filters.limit || 10)),
  };

  // Load guest tasks when filters change
  useState(() => {
    if (!token) {
      const stored = localStorage.getItem('guest_tasks');
      const allTasks: Task[] = stored ? JSON.parse(stored) : [];
      setGuestTotal(allTasks.length);
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
    onSuccess: () => {
      if (token) {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      } else {
        const stored = localStorage.getItem('guest_tasks');
        const allTasks: Task[] = stored ? JSON.parse(stored) : [];
        setGuestTotal(allTasks.length);
        setGuestTasks(getGuestTasks(filters));
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
    onSuccess: () => {
      if (token) {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      } else {
        setGuestTasks(getGuestTasks(filters));
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
    onSuccess: () => {
      if (token) {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      } else {
        const stored = localStorage.getItem('guest_tasks');
        const allTasks: Task[] = stored ? JSON.parse(stored) : [];
        setGuestTotal(allTasks.length);
        setGuestTasks(getGuestTasks(filters));
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
    const updated = { ...filters, ...newFilters, page: 1 }; // Reset to page 1 on filter change
    setFilters(updated);
    if (!token) {
      const stored = localStorage.getItem('guest_tasks');
      const allTasks: Task[] = stored ? JSON.parse(stored) : [];
      setGuestTotal(allTasks.length);
      setGuestTasks(getGuestTasks(updated));
    }
  };

  const handlePageChange = (newPage: number) => {
    const updated = { ...filters, page: newPage };
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
          <>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-700">
                  Your Tasks ({pagination?.total || 0})
                </h2>
                <p className="text-sm text-gray-500">
                  Page {pagination?.page || 1} of {pagination?.totalPages || 1}
                </p>
              </div>
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onUpdate={handleUpdateTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 bg-white p-4 rounded-xl shadow-md">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all"
                >
                  ← Previous
                </button>
                
                <div className="flex gap-1">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 rounded-lg font-medium transition-all ${
                        page === pagination.page
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
