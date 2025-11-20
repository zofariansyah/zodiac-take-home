import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { authController } from './controllers/auth.controller';
import { taskController } from './controllers/task.controller';
import { AuthService } from './services/auth.service';
import { env, validateEnv } from './utils/env';

// Validate environment variables
validateEnv();

const authService = new AuthService();

const app = new Elysia()
    .use(cors())
    .get('/', () => 'Zodiac Task Manager API')
    .derive(async ({ request }) => {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) return { userId: null };

        const token = authHeader.split(' ')[1];
        try {
            const userId = await authService.verifyToken(token);
            return { userId };
        } catch {
            return { userId: null };
        }
    })
    .use(authController)
    .use(taskController)
    .listen(env.PORT);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
