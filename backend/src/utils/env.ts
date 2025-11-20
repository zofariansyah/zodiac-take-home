// Environment variables configuration
export const env = {
    DATABASE_URL: process.env.DATABASE_URL || '',
    JWT_SECRET: process.env.JWT_SECRET || 'supersecret',
    PORT: parseInt(process.env.PORT || '3000'),
    NODE_ENV: process.env.NODE_ENV || 'development',
} as const;

// Validate required environment variables
export function validateEnv() {
    if (!env.DATABASE_URL) {
        throw new Error('DATABASE_URL is required');
    }
    if (env.NODE_ENV === 'production' && env.JWT_SECRET === 'supersecret') {
        throw new Error('JWT_SECRET must be set in production');
    }
}
