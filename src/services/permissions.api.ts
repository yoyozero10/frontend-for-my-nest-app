import apiClient from '../lib/axios';

export interface Permission {
    _id: string;
    name: string;
    apiPath: string;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    module: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreatePermissionDto {
    name: string;
    apiPath: string;
    method: string;
    module: string;
}

export interface UpdatePermissionDto {
    name?: string;
    apiPath?: string;
    method?: string;
    module?: string;
}

export const permissionsApi = {
    // Get all permissions with pagination
    getAllPermissions: async (page = 1, limit = 10) => {
        const params = new URLSearchParams({
            current: page.toString(),
            pageSize: limit.toString(),
        });
        return apiClient.get(`/permissions?${params.toString()}`);
    },

    // Get permission by ID
    getPermissionById: async (id: string) => {
        return apiClient.get(`/permissions/${id}`);
    },

    // Create new permission
    createPermission: async (data: CreatePermissionDto) => {
        return apiClient.post('/permissions', data);
    },

    // Update permission
    updatePermission: async (id: string, data: UpdatePermissionDto) => {
        return apiClient.patch(`/permissions/${id}`, data);
    },

    // Delete permission
    deletePermission: async (id: string) => {
        return apiClient.delete(`/permissions/${id}`);
    }
};
