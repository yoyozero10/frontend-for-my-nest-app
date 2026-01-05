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
    }
};
