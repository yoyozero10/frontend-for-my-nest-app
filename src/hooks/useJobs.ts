import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobService } from '../services/jobService';
import type { CreateJobDto, UpdateJobDto } from '../types/job';

// Hook lấy danh sách jobs
export const useJobs = (page = 1, limit = 10, filters?: {
    location?: string;
    level?: string;
    skills?: string[];
}) => {
    return useQuery({
        queryKey: ['jobs', page, limit, filters],
        queryFn: () => jobService.getAllJobs(page, limit, filters),
        staleTime: 5 * 60 * 1000, // Cache 5 phút
    });
};

// Hook lấy chi tiết job
export const useJobDetail = (id: string) => {
    return useQuery({
        queryKey: ['job', id],
        queryFn: () => jobService.getJobById(id),
        enabled: !!id, // Chỉ fetch khi có id
    });
};

// Hook tạo job mới
export const useCreateJob = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateJobDto) => jobService.createJob(data),
        onSuccess: () => {
            // Invalidate jobs list để refetch
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
        },
    });
};

// Hook cập nhật job
export const useUpdateJob = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateJobDto }) =>
            jobService.updateJob(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
        },
    });
};

// Hook xóa job
export const useDeleteJob = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => jobService.deleteJob(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
        },
    });
};
