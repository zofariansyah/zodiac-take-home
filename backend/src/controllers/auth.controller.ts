import { Elysia } from 'elysia';
import { AuthService } from '../services/auth.service';
import { registerSchema, loginSchema } from '../schemas';
import { successResponse, errorResponse } from '../utils/response';

const authService = new AuthService();

export const authController = new Elysia({ prefix: '/auth' })
    .post('/register', async ({ body, set }: any) => {
        try {
            const result = await authService.register(body.email, body.password);
            set.status = 201;
            return successResponse(result, 'User registered successfully');
        } catch (error: any) {
            set.status = error.statusCode || 500;
            return errorResponse(error.message);
        }
    }, {
        body: registerSchema,
    })
    .post('/login', async ({ body, set }: any) => {
        try {
            const result = await authService.login(body.email, body.password);
            return successResponse(result, 'Login successful');
        } catch (error: any) {
            set.status = error.statusCode || 500;
            return errorResponse(error.message);
        }
    }, {
        body: loginSchema,
    });
