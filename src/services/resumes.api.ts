import apiClient from '../lib/axios';

interface CreateResumeData {
    url: string;
    companyId: string;
    jobId: string;
}

export const resumesApi = {
    createResume: async (data: CreateResumeData) => {
        return apiClient.post('/resumes', data);
    },

    getMyResumes: async () => {
        return apiClient.post('/resumes/by-user');
    },

    // Admin: Get all resumes with pagination and filters
    getAllResumes: async (page = 1, limit = 10, status?: string) => {
        const params = new URLSearchParams({
            current: page.toString(),
            pageSize: limit.toString(),
        });
        if (status) params.append('status', status);

        return apiClient.get(`/resumes?${params.toString()}`);
    },

    // Admin: Update resume status
    updateResumeStatus: async (id: string, status: string) => {
        return apiClient.patch(`/resumes/${id}`, { status });
    }
};
