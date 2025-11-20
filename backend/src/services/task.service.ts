import { TaskRepository } from '../repositories';
import { NotFoundError, UnauthorizedError } from '../utils/errors';

const taskRepository = new TaskRepository();

export class TaskService {
    async getTasks(params: {
        userId: number;
        search?: string;
        status?: 'completed' | 'active';
        sortBy?: 'createdAt' | 'title' | 'updatedAt';
        order?: 'asc' | 'desc';
        page?: number;
        limit?: number;
    }) {
        const { userId, search, status, sortBy = 'createdAt', order = 'desc', page = 1, limit = 10 } = params;

        const skip = (page - 1) * limit;
        const where: any = {};

        // Build where clause
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (status === 'completed') {
            where.completed = true;
        } else if (status === 'active') {
            where.completed = false;
        }

        // Execute queries in parallel
        const [tasks, total] = await Promise.all([
            taskRepository.findMany({
                userId,
                where,
                orderBy: { [sortBy]: order },
                skip,
                take: limit,
            }),
            taskRepository.count({ userId, where }),
        ]);

        return {
            tasks,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async createTask(data: {
        title: string;
        description?: string;
        completed?: boolean;
        userId: number;
    }) {
        return taskRepository.create(data);
    }

    async updateTask(params: {
        id: number;
        userId: number;
        updates: {
            title?: string;
            description?: string;
            completed?: boolean;
        };
    }) {
        const task = await taskRepository.findById(params.id);

        if (!task) {
            throw new NotFoundError('Task not found');
        }

        if (task.userId !== params.userId) {
            throw new UnauthorizedError('Not authorized to update this task');
        }

        return taskRepository.update(params.id, params.updates);
    }

    async deleteTask(params: { id: number; userId: number }) {
        const task = await taskRepository.findById(params.id);

        if (!task) {
            throw new NotFoundError('Task not found');
        }

        if (task.userId !== params.userId) {
            throw new UnauthorizedError('Not authorized to delete this task');
        }

        return taskRepository.delete(params.id);
    }
}
