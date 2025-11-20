// Custom error classes
export class AppError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public isOperational = true
    ) {
        super(message);
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(400, message);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(401, message);
    }
}

export class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(404, message);
    }
}

// Error handler plugin for Elysia
export function errorHandler(error: Error) {
    if (error instanceof AppError) {
        return {
            error: error.message,
            statusCode: error.statusCode,
        };
    }

    // Log unexpected errors
    console.error('Unexpected error:', error);

    return {
        error: 'Internal server error',
        statusCode: 500,
    };
}
