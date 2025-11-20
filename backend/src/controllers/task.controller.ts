import { Elysia } from 'elysia';
import { TaskService } from '../services/task.service';
import { createTaskSchema, updateTaskSchema, taskQuerySchema } from '../schemas';
import { successResponse, errorResponse } from '../utils/response';

const taskService = new TaskService();

export const taskController = new Elysia({ prefix: '/tasks' })
    .get('/', async (context: any) => {
        const userId = context.userId;
        if (!userId) {
            context.set.status = 401;
            return errorResponse('Unauthorized');
        }

        try {
            const { search, status, sortBy, order, page, limit } = context.query as {
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
            return successResponse(result, 'Tasks retrieved successfully');
        } catch (error: unknown) {
            const err = error as { statusCode?: number; message: string };
            context.set.status = err.statusCode || 500;
            return errorResponse(err.message);
        }
    }, {
        query: taskQuerySchema,
    })
    .post('/', async (context: any) => {
        const userId = context.userId;
        if (!userId) {
            context.set.status = 401;
            return errorResponse('Unauthorized');
        }

        try {
            const result = await taskService.createTask({
                ...context.body,
                userId,
            });
            context.set.status = 201;
            return successResponse(result, 'Task created successfully');
        } catch (error: unknown) {
            const err = error as { statusCode?: number; message: string };
            context.set.status = err.statusCode || 500;
            return errorResponse(err.message);
        }
    }, {
        body: createTaskSchema,
    })
    .put('/:id', async (context: any) => {
        const userId = context.userId;
        if (!userId) {
            context.set.status = 401;
            return errorResponse('Unauthorized');
        }

        try {
            const result = await taskService.updateTask({
                id: Number(context.params.id),
                userId,
                updates: context.body,
            });
            return successResponse(result, 'Task updated successfully');
        } catch (error: unknown) {
            const err = error as { statusCode?: number; message: string };
            context.set.status = err.statusCode || 500;
            return errorResponse(err.message);
        }
    }, {
        body: updateTaskSchema,
    })
    .delete('/:id', async (context: any) => {
        const userId = context.userId;
        if (!userId) {
            context.set.status = 401;
            return errorResponse('Unauthorized');
        }

        try {
            await taskService.deleteTask({
                id: Number(context.params.id),
                userId,
            });
            return successResponse(null, 'Task deleted successfully');
        } catch (error: unknown) {
            const err = error as { statusCode?: number; message: string };
            context.set.status = err.statusCode || 500;
            return errorResponse(err.message);
        }
    });
