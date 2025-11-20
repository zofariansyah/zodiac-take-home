import { Elysia, t } from 'elysia'
import { cors } from '@elysiajs/cors'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const app = new Elysia()
    .use(cors())
    .get('/', () => 'Task Manager API')
    .get('/tasks', async () => {
        return await prisma.task.findMany({ orderBy: { createdAt: 'desc' } })
    })
    .post('/tasks', async ({ body }) => {
        return await prisma.task.create({
            data: body
        })
    }, {
        body: t.Object({
            title: t.String(),
            description: t.Optional(t.String()),
            completed: t.Optional(t.Boolean())
        })
    })
    .put('/tasks/:id', async ({ params: { id }, body }) => {
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
    .delete('/tasks/:id', async ({ params: { id } }) => {
        return await prisma.task.delete({
            where: { id: Number(id) }
        })
    })
    .listen(3000)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
