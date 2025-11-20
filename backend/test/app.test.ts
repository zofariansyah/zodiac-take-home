import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

describe('Auth Module', () => {
    beforeAll(async () => {
        // Clean up test data
        await prisma.task.deleteMany({});
        await prisma.user.deleteMany({});
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should hash passwords correctly', async () => {
        const password = 'testpassword123';
        const hashed = await bcrypt.hash(password, 10);
        const isValid = await bcrypt.compare(password, hashed);
        expect(isValid).toBe(true);
    });

    it('should create a user', async () => {
        const user = await prisma.user.create({
            data: {
                email: 'test@example.com',
                password: await bcrypt.hash('password123', 10),
            },
        });

        expect(user.email).toBe('test@example.com');
        expect(user.id).toBeGreaterThan(0);
    });

    it('should find user by email', async () => {
        const user = await prisma.user.findUnique({
            where: { email: 'test@example.com' },
        });

        expect(user).not.toBeNull();
        expect(user?.email).toBe('test@example.com');
    });
});

describe('Task CRUD', () => {
    let userId: number;

    beforeAll(async () => {
        const user = await prisma.user.create({
            data: {
                email: 'taskuser@example.com',
                password: await bcrypt.hash('password', 10),
            },
        });
        userId = user.id;
    });

    it('should create a task', async () => {
        const task = await prisma.task.create({
            data: {
                title: 'Test Task',
                description: 'Test Description',
                userId,
            },
        });

        expect(task.title).toBe('Test Task');
        expect(task.userId).toBe(userId);
        expect(task.completed).toBe(false);
    });

    it('should fetch tasks for user', async () => {
        const tasks = await prisma.task.findMany({
            where: { userId },
        });

        expect(tasks.length).toBeGreaterThan(0);
        expect(tasks[0].userId).toBe(userId);
    });

    it('should update a task', async () => {
        const task = await prisma.task.findFirst({ where: { userId } });
        if (!task) throw new Error('Task not found');

        const updated = await prisma.task.update({
            where: { id: task.id },
            data: { completed: true },
        });

        expect(updated.completed).toBe(true);
    });

    it('should delete a task', async () => {
        const task = await prisma.task.findFirst({ where: { userId } });
        if (!task) throw new Error('Task not found');

        await prisma.task.delete({ where: { id: task.id } });

        const deleted = await prisma.task.findUnique({ where: { id: task.id } });
        expect(deleted).toBeNull();
    });
});
