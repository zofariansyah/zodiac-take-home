import { Elysia } from 'elysia';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export const auth = (app: Elysia) =>
    app
        .group('/auth', (app) =>
            app
                .post('/register', async ({ body, set }: any) => {
                    const { email, password } = body;
                    if (!email || !password) {
                        set.status = 400;
                        return { error: 'Email and password required' };
                    }

                    const existingUser = await prisma.user.findUnique({ where: { email } });
                    if (existingUser) {
                        set.status = 400;
                        return { error: 'User already exists' };
                    }

                    const hashedPassword = await bcrypt.hash(password, 10);
                    const user = await prisma.user.create({
                        data: { email, password: hashedPassword },
                    });

                    return { id: user.id, email: user.email };
                })
                .post('/login', async ({ body, set }: any) => {
                    const { email, password } = body;
                    const user = await prisma.user.findUnique({ where: { email } });

                    if (!user || !(await bcrypt.compare(password, user.password))) {
                        set.status = 401;
                        return { error: 'Invalid credentials' };
                    }

                    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' });
                    return { token, user: { id: user.id, email: user.email } };
                })
        );

export const authenticate = async (req: Request) => {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return null;

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
        return decoded.userId;
    } catch {
        return null;
    }
};
