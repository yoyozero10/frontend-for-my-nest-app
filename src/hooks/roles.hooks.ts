import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rolesApi } from '../services/roles.api';
import type { CreateRoleDto, UpdateRoleDto } from '../services/roles.api';

// Get all roles with pagination
export const useAllRoles = (page = 1, limit = 10) => {
    return useQuery({
        queryKey: ['all-roles', page, limit],
        queryFn: () => rolesApi.getAllRoles(page, limit),
        staleTime: 10 * 1000,
    });
};

// Get role by ID
export const useRoleById = (id: string) => {
    return useQuery({
        queryKey: ['role', id],
        queryFn: () => rolesApi.getRoleById(id),
        enabled: !!id,
    });
};

// Create role
export const useCreateRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateRoleDto) => rolesApi.createRole(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-roles'] });
        },
    });
};

// Update role
export const useUpdateRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateRoleDto }) =>
            rolesApi.updateRole(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-roles'] });
        },
    });
};

// Delete role
export const useDeleteRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => rolesApi.deleteRole(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-roles'] });
        },
    });
};
