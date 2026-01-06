import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../services/users.api';

// Get all users
export const useAllUsers = (page = 1, limit = 10) => {
    return useQuery({
        queryKey: ['all-users', page, limit],
        queryFn: () => usersApi.getAllUsers(page, limit),
        staleTime: 5 * 60 * 1000,
    });
};

// Update user
export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { _id: string; role: string }) => usersApi.updateUser(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-users'] });
        },
    });
};

// Delete user
export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => usersApi.deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-users'] });
        },
    });
};
