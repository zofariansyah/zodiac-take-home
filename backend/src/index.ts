import { Elysia, t } from 'elysia'
import { cors } from '@elysiajs/cors'
import { PrismaClient } from '@prisma/client'
import { auth, authenticate } from './auth'

const prisma = new PrismaClient()

const app = new Elysia()
    .use(cors())
    .use(auth)
    .get('/', () => 'Task Manager API')
    .derive(async ({ request }) => {
        const userId = await authenticate(request);
        return { userId };
    })
    .get('/tasks', async ({ userId, set, query }) => {
        if (!userId) {
            set.status = 401;
            return { error: 'Unauthorized' };
        }

        const { search, status, sortBy = 'createdAt', order = 'desc' } = query as {
            search?: string;
            status?: 'completed' | 'active';
            sortBy?: 'createdAt' | 'title' | 'updatedAt';
            order?: 'asc' | 'desc';
        };

        const where: any = { userId };

        // Filter by search
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        // Filter by status
        if (status === 'completed') {
            where.completed = true;
        } else if (status === 'active') {
            where.completed = false;
        }

        return await prisma.task.findMany({
            where,
            orderBy: { [sortBy]: order }
        });
    })
    .post('/tasks', async ({ userId, body, set }) => {
        if (!userId) {
            set.status = 401;
            return { error: 'Unauthorized' };
        }
        return await prisma.task.create({
            data: {
                ...(body as any),
                userId
            }
        })
    }, {
        body: t.Object({
            title: t.String(),
            description: t.Optional(t.String()),
            completed: t.Optional(t.Boolean())
        })
    })
    .put('/tasks/:id', async ({ userId, params: { id }, body, set }) => {
        if (!userId) {
            set.status = 401;
            return { error: 'Unauthorized' };
        }
        // Ensure task belongs to user
        const task = await prisma.task.findUnique({ where: { id: Number(id) } });
        if (!task || task.userId !== userId) {
            set.status = 404;
            return { error: 'Task not found' };
        }

        return await prisma.task.update({
            where: { id: Number(id) },
            data: body
        })
    }, {
        body: t.Object({
            title: t.Optional(t.String()),
            description: t.Optional(t.String()),
            completed: t.Optional(t.Boolean())
        })
    })
    .delete('/tasks/:id', async ({ userId, params: { id }, set }) => {
        if (!userId) {
            set.status = 401;
            return { error: 'Unauthorized' };
        }
        const task = await prisma.task.findUnique({ where: { id: Number(id) } });
        if (!task || task.userId !== userId) {
            set.status = 404;
            return { error: 'Task not found' };
        }

        return await prisma.task.delete({
            where: { id: Number(id) }
        })
    })
    .listen(3000)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
