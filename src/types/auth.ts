export interface User {
    _id: string;
    name: string;
    email: string;
    role?: {
        _id: string;
        name: string;
    };
    permissions?: Array<{
        _id: string;
        name: string;
        apiPath: string;
        method: string;
        module: string;
    }>;
    createdAt?: string;
    updatedAt?: string;
}

export interface Permission {
    _id: string;
    name: string;
    apiPath: string;
    method: string;
    module: string;
}

export interface RegisterDto {
    name: string;
    email: string;
    password: string;
    age?: string; // Backend expects string
    gender?: string;
    address?: string;
}

export interface LoginDto {
    username: string; // email
    password: string;
}

export interface AuthResponse {
    statusCode: number;
    message: string;
    data: {
        access_token: string;
        user: User;
    };
}

export interface AccountResponse {
    statusCode: number;
    message: string;
    data: {
        user: User;
    };
}
