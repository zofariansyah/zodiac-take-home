const API_URL = 'http://localhost:3000';

export interface Task {
    id: number;
    title: string;
    description?: string | null;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
}

// LocalStorage operations for guest mode
const STORAGE_KEY = 'guest_tasks';

export const getGuestTasks = (): Task[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
};

const saveGuestTasks = (tasks: Task[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export const createGuestTask = (task: { title: string; description?: string }): Task => {
    const tasks = getGuestTasks();
    const newTask: Task = {
        id: Date.now(),
        title: task.title,
        description: task.description || null,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    tasks.unshift(newTask);
    saveGuestTasks(tasks);
    return newTask;
};

export const updateGuestTask = (id: number, updates: Partial<Task>): Task => {
    const tasks = getGuestTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');
    tasks[index] = { ...tasks[index], ...updates, updatedAt: new Date().toISOString() };
    saveGuestTasks(tasks);
    return tasks[index];
};

export const deleteGuestTask = (id: number) => {
    const tasks = getGuestTasks().filter(t => t.id !== id);
    saveGuestTasks(tasks);
};

// API operations for authenticated users
export const fetchTasks = async (token: string): Promise<Task[]> => {
    const res = await fetch(`${API_URL}/tasks`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return res.json();
};

export const createTask = async (token: string, task: { title: string; description?: string }) => {
    const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error('Failed to create task');
    return res.json();
};

export const updateTask = async (token: string, id: number, updates: Partial<Task>) => {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update task');
    return res.json();
};

export const deleteTask = async (token: string, id: number) => {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to delete task');
};
