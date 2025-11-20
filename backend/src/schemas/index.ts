import { t } from 'elysia';

// Auth schemas
export const registerSchema = t.Object({
    email: t.String({ format: 'email' }),
    password: t.String({ minLength: 6 }),
});

export const loginSchema = t.Object({
    email: t.String({ format: 'email' }),
    password: t.String(),
});

// Task schemas
export const createTaskSchema = t.Object({
    title: t.String({ minLength: 1, maxLength: 255 }),
    description: t.Optional(t.String({ maxLength: 1000 })),
    completed: t.Optional(t.Boolean()),
});

export const updateTaskSchema = t.Object({
    title: t.Optional(t.String({ minLength: 1, maxLength: 255 })),
    description: t.Optional(t.String({ maxLength: 1000 })),
    completed: t.Optional(t.Boolean()),
});

export const taskQuerySchema = t.Object({
    search: t.Optional(t.String()),
    status: t.Optional(t.Union([t.Literal('completed'), t.Literal('active')])),
    sortBy: t.Optional(t.Union([t.Literal('createdAt'), t.Literal('title'), t.Literal('updatedAt')])),
    order: t.Optional(t.Union([t.Literal('asc'), t.Literal('desc')])),
    page: t.Optional(t.String()),
    limit: t.Optional(t.String()),
});
