import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/auth';
import { authService } from '../services/authService';

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;

    // Actions
    setUser: (user: User | null) => void;
    setAccessToken: (token: string | null) => void;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: localStorage.getItem('access_token'),
            isAuthenticated: !!localStorage.getItem('access_token'),

            setUser: (user) => set({ user, isAuthenticated: !!user }),

            setAccessToken: (token) => {
                if (token) {
                    localStorage.setItem('access_token', token);
                } else {
                    localStorage.removeItem('access_token');
                }
                set({ accessToken: token, isAuthenticated: !!token });
            },

            login: async (email, password) => {
                try {
                    const response = await authService.login({
                        username: email,
                        password,
                    });

                    const { access_token, user } = response.data;

                    // Lưu token và user
                    localStorage.setItem('access_token', access_token);
                    set({
                        accessToken: access_token,
                        user,
                        isAuthenticated: true,
                    });
                } catch (error) {
                    console.error('Login failed:', error);
                    throw error;
                }
            },

            logout: async () => {
                try {
                    await authService.logout();
                } catch (error) {
                    console.error('Logout failed:', error);
                } finally {
                    // Clear state dù logout thành công hay thất bại
                    localStorage.removeItem('access_token');
                    set({
                        user: null,
                        accessToken: null,
                        isAuthenticated: false,
                    });
                }
            },

            fetchUser: async () => {
                try {
                    const response = await authService.getAccount();
                    set({ user: response.data.user, isAuthenticated: true });
                } catch (error) {
                    console.error('Fetch user failed:', error);
                    // Nếu lỗi, clear auth state
                    localStorage.removeItem('access_token');
                    set({
                        user: null,
                        accessToken: null,
                        isAuthenticated: false,
                    });
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
