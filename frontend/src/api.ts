import { API_CONFIG } from './config/api';

const API_URL = API_CONFIG.BASE_URL;

export interface Task {
    id: number;
    title: string;
    description?: string | null;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface TaskFilters {
    search?: string;
    status?: 'completed' | 'active' | 'all';
    sortBy?: 'createdAt' | 'title' | 'updatedAt';
    order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

export interface PaginatedResponse {
    tasks: Task[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// LocalStorage operations for guest mode
const STORAGE_KEY = 'guest_tasks';

export const getGuestTasks = (filters?: TaskFilters): Task[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    let tasks: Task[] = stored ? JSON.parse(stored) : [];

    // Apply filters
    if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        tasks = tasks.filter(t =>
            t.title.toLowerCase().includes(searchLower) ||
            t.description?.toLowerCase().includes(searchLower)
        );
    }

    if (filters?.status === 'completed') {
        tasks = tasks.filter(t => t.completed);
    } else if (filters?.status === 'active') {
        tasks = tasks.filter(t => !t.completed);
    }

    // Apply sorting
    const sortBy = filters?.sortBy || 'createdAt';
    const order = filters?.order || 'desc';
    tasks.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        if (typeof aVal === 'string' && typeof bVal === 'string') {
            return order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }
        return 0;
    });

    // Apply pagination for guest mode
    if (filters?.page && filters?.limit) {
        const start = (filters.page - 1) * filters.limit;
        tasks = tasks.slice(start, start + filters.limit);
    }

    return tasks;
};

const saveGuestTasks = (tasks: Task[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export const createGuestTask = (task: { title: string; description?: string }): Task => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const tasks: Task[] = stored ? JSON.parse(stored) : [];
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
    const stored = localStorage.getItem(STORAGE_KEY);
    const tasks: Task[] = stored ? JSON.parse(stored) : [];
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');
    tasks[index] = { ...tasks[index], ...updates, updatedAt: new Date().toISOString() };
    saveGuestTasks(tasks);
    return tasks[index];
};

export const deleteGuestTask = (id: number) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const tasks: Task[] = stored ? JSON.parse(stored) : [];
    const filtered = tasks.filter(t => t.id !== id);
    saveGuestTasks(filtered);
};

// API operations for authenticated users
export const fetchTasks = async (token: string, filters?: TaskFilters): Promise<PaginatedResponse> => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.order) params.append('order', filters.order);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const url = `${API_URL}/tasks${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch tasks');
    const response = await res.json();
    return response.data; // Extract data from standard response
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
    const response = await res.json();
    return response.data; // Extract data from standard response
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
    const response = await res.json();
    return response.data; // Extract data from standard response
};

export const deleteTask = async (token: string, id: number) => {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to delete task');
};
