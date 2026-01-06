import apiClient from '../lib/axios';

export const usersApi = {
    // Get all users with pagination
    getAllUsers: async (page = 1, limit = 10) => {
        const params = new URLSearchParams({
            current: page.toString(),
            pageSize: limit.toString(),
        });

        return apiClient.get(`/users?${params.toString()}`);
    },

    // Update user (change role)
    updateUser: async (data: { _id: string; role: string }) => {
        return apiClient.patch('/users', data);
    },

    // Delete user
    deleteUser: async (id: string) => {
        return apiClient.delete(`/users/${id}`);
    }
};
