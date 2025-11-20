import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories';
import { ValidationError, UnauthorizedError } from '../utils/errors';
import { env } from '../utils/env';

const userRepository = new UserRepository();

export class AuthService {
    async register(email: string, password: string) {
        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            throw new ValidationError('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userRepository.create({
            email,
            password: hashedPassword,
        });

        return { id: user.id, email: user.email };
    }

    async login(email: string, password: string) {
        const user = await userRepository.findByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedError('Invalid credentials');
        }

        const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, {
            expiresIn: '1d',
        });

        return {
            token,
            user: { id: user.id, email: user.email },
        };
    }

    async verifyToken(token: string): Promise<number> {
        try {
            const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: number };
            return decoded.userId;
        } catch {
            throw new UnauthorizedError('Invalid token');
        }
    }
}
