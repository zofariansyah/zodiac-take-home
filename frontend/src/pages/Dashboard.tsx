import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { type Task, fetchTasks, createTask, updateTask, deleteTask, getGuestTasks, createGuestTask, updateGuestTask, deleteGuestTask } from '../api';
import { TaskCard } from '../components/TaskCard';
import { TaskForm } from '../components/TaskForm';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const { user, token, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTasks = async () => {
    try {
      if (token) {
        const data = await fetchTasks(token);
        setTasks(data);
      } else {
        const data = getGuestTasks();
        setTasks(data);
      }
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [token]);

  const handleCreateTask = async (taskData: { title: string; description?: string }) => {
    if (token) {
      await createTask(token, taskData);
      await loadTasks();
    } else {
      createGuestTask(taskData);
      setTasks(getGuestTasks());
    }
  };

  const handleUpdateTask = async (id: number, updates: Partial<Task>) => {
    if (token) {
      await updateTask(token, id, updates);
      await loadTasks();
    } else {
      updateGuestTask(id, updates);
      setTasks(getGuestTasks());
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (token) {
      await deleteTask(token, id);
      await loadTasks();
    } else {
      deleteGuestTask(id);
      setTasks(getGuestTasks());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto">
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

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="text-gray-500 mt-4">Loading tasks...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-400 text-red-700 px-6 py-4 rounded-xl" role="alert">
            <strong className="font-bold">Error: </strong>
            <span>{error}</span>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-md">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-500 text-lg">No tasks yet. Add one above to get started!</p>
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
