import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class TaskRepository {
    async findMany(params: {
        userId: number;
        where?: any;
        orderBy?: any;
        skip?: number;
        take?: number;
    }) {
        return prisma.task.findMany({
            where: { userId: params.userId, ...params.where },
            orderBy: params.orderBy,
            skip: params.skip,
            take: params.take,
        });
    }

    async count(params: { userId: number; where?: any }) {
        return prisma.task.count({
            where: { userId: params.userId, ...params.where },
        });
    }

    async findById(id: number) {
        return prisma.task.findUnique({ where: { id } });
    }

    async create(data: {
        title: string;
        description?: string;
        completed?: boolean;
        userId: number;
    }) {
        return prisma.task.create({ data });
    }

    async update(id: number, data: {
        title?: string;
        description?: string;
        completed?: boolean;
    }) {
        return prisma.task.update({
            where: { id },
            data,
        });
    }

    async delete(id: number) {
        return prisma.task.delete({ where: { id } });
    }
}

export class UserRepository {
    async findByEmail(email: string) {
        return prisma.user.findUnique({ where: { email } });
    }

    async create(data: { email: string; password: string }) {
        return prisma.user.create({ data });
    }
}
