import { useEffect, useState } from 'react';
import { type Task, fetchTasks } from './api';
import { TaskCard } from './components/TaskCard';
import { TaskForm } from './components/TaskForm';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTasks = async () => {
    try {
      const data = await fetchTasks();
      setTasks(data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to load tasks. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
          <p className="text-gray-600 mt-2">Simple & Effective</p>
        </header>

        <TaskForm onTaskCreated={loadTasks} />

        {loading ? (
          <p className="text-center text-gray-500">Loading tasks...</p>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        ) : tasks.length === 0 ? (
          <p className="text-center text-gray-500">No tasks yet. Add one above!</p>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onUpdate={loadTasks} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
