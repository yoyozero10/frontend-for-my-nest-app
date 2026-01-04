import axiosInstance from '../lib/axios';
import type {
    RegisterDto,
    LoginDto,
    AuthResponse,
    AccountResponse,
} from '../types/auth';

export const authService = {
    // Đăng ký tài khoản mới
    async register(data: RegisterDto) {
        const response = await axiosInstance.post('/auth/register', data);
        return response.data;
    },

    // Đăng nhập
    async login(data: LoginDto): Promise<AuthResponse> {
        const response = await axiosInstance.post<AuthResponse>('/auth/login', data);
        return response.data;
    },

    // Lấy thông tin user hiện tại
    async getAccount(): Promise<AccountResponse> {
        const response = await axiosInstance.get<AccountResponse>('/auth/account');
        return response.data;
    },

    // Refresh access token
    async refreshToken() {
        const response = await axiosInstance.get('/auth/refresh');
        return response.data;
    },

    // Đăng xuất
    async logout() {
        const response = await axiosInstance.post('/auth/logout');
        return response.data;
    },
};
