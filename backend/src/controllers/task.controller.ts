import { Elysia } from 'elysia';
import { TaskService } from '../services/task.service';
import { createTaskSchema, updateTaskSchema, taskQuerySchema } from '../schemas';

const taskService = new TaskService();

export const taskController = new Elysia({ prefix: '/tasks' })
    .derive(({ userId }) => ({ userId }))
    .get('/', async ({ userId, query, set }) => {
        if (!userId) {
            set.status = 401;
            return { error: 'Unauthorized' };
        }

        try {
            const { search, status, sortBy, order, page, limit } = query as {
                search?: string;
                status?: 'completed' | 'active';
                sortBy?: 'createdAt' | 'title' | 'updatedAt';
                order?: 'asc' | 'desc';
                page?: string;
                limit?: string;
            };
            const result = await taskService.getTasks({
                userId,
                search,
                status,
                sortBy,
                order,
                page: page ? parseInt(page) : undefined,
                limit: limit ? parseInt(limit) : undefined,
            });
            return result;
        } catch (error: any) {
            set.status = error.statusCode || 500;
            return { error: error.message };
        }
    }, {
        query: taskQuerySchema,
    })
    .post('/', async ({ userId, body, set }) => {
        if (!userId) {
            set.status = 401;
            return { error: 'Unauthorized' };
        }

        try {
            const result = await taskService.createTask({
                ...body,
                userId,
            });
            return result;
        } catch (error: any) {
            set.status = error.statusCode || 500;
            return { error: error.message };
        }
    }, {
        body: createTaskSchema,
    })
    .put('/:id', async ({ userId, params, body, set }) => {
        if (!userId) {
            set.status = 401;
            return { error: 'Unauthorized' };
        }

        try {
            const result = await taskService.updateTask({
                id: Number(params.id),
                userId,
                updates: body,
            });
            return result;
        } catch (error: any) {
            set.status = error.statusCode || 500;
            return { error: error.message };
        }
    }, {
        body: updateTaskSchema,
    })
    .delete('/:id', async ({ userId, params, set }) => {
        if (!userId) {
            set.status = 401;
            return { error: 'Unauthorized' };
        }

        try {
            const result = await taskService.deleteTask({
                id: Number(params.id),
                userId,
            });
            return result;
        } catch (error: any) {
            set.status = error.statusCode || 500;
            return { error: error.message };
        }
    });
