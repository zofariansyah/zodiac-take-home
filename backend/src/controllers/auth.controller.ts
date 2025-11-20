import { Elysia } from 'elysia';
import { AuthService } from '../services/auth.service';
import { registerSchema, loginSchema } from '../schemas';

const authService = new AuthService();

export const authController = new Elysia({ prefix: '/auth' })
    .post('/register', async ({ body, set }) => {
        try {
            const result = await authService.register(body.email, body.password);
            return result;
        } catch (error: any) {
            set.status = error.statusCode || 500;
            return { error: error.message };
        }
    }, {
        body: registerSchema,
    })
    .post('/login', async ({ body, set }) => {
        try {
            const result = await authService.login(body.email, body.password);
            return result;
        } catch (error: any) {
            set.status = error.statusCode || 500;
            return { error: error.message };
        }
    }, {
        body: loginSchema,
    });
