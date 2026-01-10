import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { permissionsApi } from '../services/permissions.api';
import type { CreatePermissionDto, UpdatePermissionDto } from '../services/permissions.api';

// Get all permissions with pagination
export const useAllPermissions = (page = 1, limit = 10) => {
    return useQuery({
        queryKey: ['all-permissions', page, limit],
        queryFn: () => permissionsApi.getAllPermissions(page, limit),
        staleTime: 10 * 1000,
    });
};

// Get permission by ID
export const usePermissionById = (id: string) => {
    return useQuery({
        queryKey: ['permission', id],
        queryFn: () => permissionsApi.getPermissionById(id),
        enabled: !!id,
    });
};

// Create permission
export const useCreatePermission = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreatePermissionDto) => permissionsApi.createPermission(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-permissions'] });
        },
    });
};

// Update permission
export const useUpdatePermission = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdatePermissionDto }) =>
            permissionsApi.updatePermission(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-permissions'] });
        },
    });
};

// Delete permission
export const useDeletePermission = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => permissionsApi.deletePermission(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-permissions'] });
        },
    });
};
