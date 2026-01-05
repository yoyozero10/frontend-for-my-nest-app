import { useMutation, useQuery } from '@tanstack/react-query';
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
