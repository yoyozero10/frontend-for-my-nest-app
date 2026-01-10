import apiClient from '../lib/axios';

export interface Subscriber {
    _id: string;
    name: string;
    email: string;
    skills: string[];
    createdBy?: {
        _id: string;
        email: string;
    };
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateSubscriberDto {
    name: string;
    email: string;
    skills: string[];
}

export interface UpdateSubscriberDto {
    name?: string;
    email?: string;
    skills?: string[];
}

export const subscribersApi = {
    // Create subscriber (User subscribes)
    createSubscriber: async (data: CreateSubscriberDto) => {
        return apiClient.post('/subscribers', data);
    },

    // Get all subscribers (Admin only)
    getAllSubscribers: async (page = 1, limit = 10) => {
        const params = new URLSearchParams({
            current: page.toString(),
            pageSize: limit.toString(),
        });
        return apiClient.get(`/subscribers?${params.toString()}`);
    },

    // Get subscriber by ID
    getSubscriberById: async (id: string) => {
        return apiClient.get(`/subscribers/${id}`);
    },

    // Update subscriber
    updateSubscriber: async (id: string, data: UpdateSubscriberDto) => {
        return apiClient.patch(`/subscribers/${id}`, data);
    },

    // Delete subscriber
    deleteSubscriber: async (id: string) => {
        return apiClient.delete(`/subscribers/${id}`);
    }
};
