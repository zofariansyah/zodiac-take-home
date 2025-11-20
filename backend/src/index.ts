import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { authController } from './controllers/auth.controller';
import { taskController } from './controllers/task.controller';
import { AuthService } from './services/auth.service';
import { env, validateEnv } from './utils/env';
import { errorResponse } from './utils/response';

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
        if (!token) return { userId: null };

        try {
            const userId = await authService.verifyToken(token);
            return { userId };
        } catch {
            return { userId: null };
        }
    })
    .onError(({ code, error, set }) => {
        // Handle validation errors
        if (code === 'VALIDATION') {
            set.status = 400;
            const validationError = error as any;
            return {
                success: false,
                message: 'Validation failed',
                errors: validationError.all ? validationError.all.map((e: any) => ({
                    field: e.path?.replace('/', '') || e.property?.replace('/', ''),
                    message: e.message || e.summary,
                })) : [{
                    field: validationError.property?.replace('/', ''),
                    message: validationError.message || validationError.summary,
                }],
            };
        }

        // Handle other errors
        console.error('Unhandled error:', error);
        set.status = 500;
        return errorResponse('Internal server error');
    })
    .use(authController)
    .use(taskController)
    .listen(env.PORT);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
