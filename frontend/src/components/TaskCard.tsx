import React from 'react';
import { type Task, updateTask, deleteTask } from '../api';

interface Props {
  task: Task;
  onUpdate: () => void;
}

export const TaskCard: React.FC<Props> = ({ task, onUpdate }) => {
  const toggleComplete = async () => {
    await updateTask(task.id, { completed: !task.completed });
    onUpdate();
  };

  const handleDelete = async () => {
    if (confirm('Are you sure?')) {
      await deleteTask(task.id);
      onUpdate();
    }
  };

  return (
    <div className={`p-4 rounded-lg shadow-md border ${task.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
            {task.title}
          </h3>
          {task.description && <p className="text-gray-600 mt-1">{task.description}</p>}
          <p className="text-xs text-gray-400 mt-2">
            Created: {new Date(task.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={toggleComplete}
            className={`px-3 py-1 rounded text-sm ${task.completed ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'} hover:opacity-80`}
          >
            {task.completed ? 'Undo' : 'Done'}
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-1 rounded text-sm bg-red-100 text-red-700 hover:opacity-80"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
