// Standard API response helpers
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
}

export function successResponse<T>(data: T, message = 'Success'): ApiResponse<T> {
    return {
        success: true,
        message,
        data,
    };
}

export function errorResponse(message: string, statusCode?: number): ApiResponse {
    return {
        success: false,
        message,
    };
}
