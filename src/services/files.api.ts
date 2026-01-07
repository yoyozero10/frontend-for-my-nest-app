import apiClient from '../lib/axios';

export const filesApi = {
    // Upload file (CV, images, etc.)
    uploadFile: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await apiClient.post('/files/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    }
};
