const API_URL = 'http://localhost:3000';

export interface Task {
    id: number;
    title: string;
    description?: string | null;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
}

export const fetchTasks = async (): Promise<Task[]> => {
    const res = await fetch(`${API_URL}/tasks`);
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return res.json();
};

export const createTask = async (task: { title: string; description?: string }) => {
    const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error('Failed to create task');
    return res.json();
};

export const updateTask = async (id: number, updates: Partial<Task>) => {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update task');
    return res.json();
};

export const deleteTask = async (id: number) => {
    const res = await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete task');
};
