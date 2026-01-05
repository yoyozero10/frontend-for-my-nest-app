import axiosInstance from '../lib/axios';
import type { Job, CreateJobDto, UpdateJobDto, JobsResponse, JobDetailResponse } from '../types/job';

export const jobService = {
    // Lấy danh sách jobs với pagination
    async getAllJobs(page = 1, limit = 10, filters?: {
        location?: string;
        level?: string;
        skills?: string[];
    }): Promise<JobsResponse> {
        const params = new URLSearchParams({
            current: page.toString(),
            pageSize: limit.toString(),
        });

        if (filters?.location) params.append('location', filters.location);
        if (filters?.level) params.append('level', filters.level);
        if (filters?.skills?.length) {
            filters.skills.forEach(skill => params.append('skills', skill));
        }

        const response = await axiosInstance.get<JobsResponse>(`/jobs?${params.toString()}`);
        return response.data;
    },

    // Lấy chi tiết job theo ID
    async getJobById(id: string): Promise<JobDetailResponse> {
        const response = await axiosInstance.get<JobDetailResponse>(`/jobs/${id}`);
        return response.data;
    },

    // Tạo job mới (HR/Admin only)
    async createJob(data: CreateJobDto): Promise<any> {
        const response = await axiosInstance.post('/jobs', data);
        return response.data;
    },

    // Cập nhật job (HR/Admin only)
    async updateJob(id: string, data: UpdateJobDto): Promise<any> {
        const response = await axiosInstance.patch(`/jobs/${id}`, data);
        return response.data;
    },

    // Xóa job (HR/Admin only)
    async deleteJob(id: string): Promise<any> {
        const response = await axiosInstance.delete(`/jobs/${id}`);
        return response.data;
    },
};
