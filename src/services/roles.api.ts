import apiClient from '../lib/axios';

export interface Role {
    _id: string;
    name: string;
    description: string;
    isActive: boolean;
    permissions: Array<{
        _id: string;
        name: string;
        apiPath: string;
        method: string;
        module: string;
    }>;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateRoleDto {
    name: string;
    description: string;
    isActive: boolean;
    permissions: string[]; // Array of permission IDs
}

export interface UpdateRoleDto {
    name?: string;
    description?: string;
    isActive?: boolean;
    permissions?: string[];
}

export const rolesApi = {
    // Get all roles with pagination
    getAllRoles: async (page = 1, limit = 10) => {
        const params = new URLSearchParams({
            current: page.toString(),
            pageSize: limit.toString(),
        });
        return apiClient.get(`/roles?${params.toString()}`);
    },

    // Get role by ID
    getRoleById: async (id: string) => {
        return apiClient.get(`/roles/${id}`);
    },

    // Create new role
    createRole: async (data: CreateRoleDto) => {
        return apiClient.post('/roles', data);
    },

    // Update role
    updateRole: async (id: string, data: UpdateRoleDto) => {
        return apiClient.patch(`/roles/${id}`, data);
    },

    // Delete role
    deleteRole: async (id: string) => {
        return apiClient.delete(`/roles/${id}`);
    }
};
