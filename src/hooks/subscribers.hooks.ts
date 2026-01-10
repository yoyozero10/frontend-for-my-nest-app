import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscribersApi } from '../services/subscribers.api';
import type { CreateSubscriberDto, UpdateSubscriberDto } from '../services/subscribers.api';

// Create subscriber (User subscribes)
export const useCreateSubscriber = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateSubscriberDto) => subscribersApi.createSubscriber(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-subscribers'] });
        },
    });
};

// Get all subscribers (Admin)
export const useAllSubscribers = (page = 1, limit = 10) => {
    return useQuery({
        queryKey: ['all-subscribers', page, limit],
        queryFn: () => subscribersApi.getAllSubscribers(page, limit),
        staleTime: 10 * 1000,
    });
};

// Get subscriber by ID
export const useSubscriberById = (id: string) => {
    return useQuery({
        queryKey: ['subscriber', id],
        queryFn: () => subscribersApi.getSubscriberById(id),
        enabled: !!id,
    });
};

// Update subscriber
export const useUpdateSubscriber = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateSubscriberDto }) =>
            subscribersApi.updateSubscriber(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-subscribers'] });
        },
    });
};

// Delete subscriber
export const useDeleteSubscriber = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => subscribersApi.deleteSubscriber(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-subscribers'] });
        },
    });
};
