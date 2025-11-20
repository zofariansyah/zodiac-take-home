import React from 'react';
import { type Task } from '../api';

interface Props {
  task: Task;
  onUpdate: (id: number, updates: Partial<Task>) => void;
  onDelete: (id: number) => void;
}

export const TaskCard: React.FC<Props> = ({ task, onUpdate, onDelete }) => {
  const toggleComplete = () => {
    onUpdate(task.id, { completed: !task.completed });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
    }
  };

  return (
    <div className={`group p-5 rounded-xl shadow-md border-2 transition-all duration-200 hover:shadow-lg ${
      task.completed 
        ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' 
        : 'bg-white border-gray-200 hover:border-blue-300'
    }`}>
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <h3 className={`text-lg font-semibold mb-1 ${
            task.completed ? 'line-through text-gray-500' : 'text-gray-900'
          }`}>
            {task.title}
          </h3>
          {task.description && (
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{task.description}</p>
          )}
          <p className="text-xs text-gray-400">
            {new Date(task.createdAt).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={toggleComplete}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              task.completed 
                ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {task.completed ? '↺ Undo' : '✓ Done'}
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
