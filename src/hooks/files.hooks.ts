import { useMutation } from '@tanstack/react-query';
import { filesApi } from '../services/files.api';

export const useUploadFile = () => {
    return useMutation({
        mutationFn: (file: File) => filesApi.uploadFile(file),
    });
};
