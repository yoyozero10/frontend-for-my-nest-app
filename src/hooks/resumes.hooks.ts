import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { resumesApi } from '../services/resumes.api';

export const useCreateResume = () => {
    return useMutation({
        mutationFn: resumesApi.createResume,
    });
};

export const useMyResumes = () => {
    return useQuery({
        queryKey: ['my-resumes'],
        queryFn: resumesApi.getMyResumes,
    });
};

// Admin: Get all resumes
export const useAllResumes = (page = 1, limit = 10, status?: string) => {
    return useQuery({
        queryKey: ['all-resumes', page, limit, status],
        queryFn: () => resumesApi.getAllResumes(page, limit, status),
        staleTime: 5 * 60 * 1000,
    });
};

// Admin: Update resume status
export const useUpdateResumeStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            resumesApi.updateResumeStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-resumes'] });
        },
    });
};
