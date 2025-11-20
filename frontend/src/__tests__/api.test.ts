import { describe, it, expect } from 'vitest';
import { getGuestTasks, createGuestTask, updateGuestTask, deleteGuestTask } from '../api';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value; },
        removeItem: (key: string) => { delete store[key]; },
        clear: () => { store = {}; },
    };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Guest Task Management', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('should create a guest task', () => {
        const task = createGuestTask({ title: 'Test Task', description: 'Test Description' });

        expect(task.title).toBe('Test Task');
        expect(task.description).toBe('Test Description');
        expect(task.completed).toBe(false);
        expect(task.id).toBeGreaterThan(0);
    });

    it('should retrieve guest tasks', () => {
        createGuestTask({ title: 'Task 1' });
        createGuestTask({ title: 'Task 2' });

        const tasks = getGuestTasks();
        expect(tasks.length).toBe(2);
        expect(tasks[0].title).toBe('Task 2'); // Most recent first
    });

    it('should update a guest task', () => {
        const task = createGuestTask({ title: 'Original' });
        const updated = updateGuestTask(task.id, { title: 'Updated', completed: true });

        expect(updated.title).toBe('Updated');
        expect(updated.completed).toBe(true);
    });

    it('should delete a guest task', () => {
        const task = createGuestTask({ title: 'To Delete' });
        deleteGuestTask(task.id);

        const tasks = getGuestTasks();
        expect(tasks.length).toBe(0);
    });

    it('should persist tasks in localStorage', () => {
        createGuestTask({ title: 'Persistent Task' });

        const stored = localStorage.getItem('guest_tasks');
        expect(stored).toBeTruthy();

        const tasks = JSON.parse(stored!);
        expect(tasks[0].title).toBe('Persistent Task');
    });
});
