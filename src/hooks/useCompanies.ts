import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companyService } from '../services/companyService';
import type { CreateCompanyDto, UpdateCompanyDto } from '../types/company';

// Hook lấy danh sách companies
export const useCompanies = (page = 1, limit = 12, filters?: {
    search?: string;
    name?: string;
    address?: string;
}) => {
    return useQuery({
        queryKey: ['companies', page, limit, filters],
        queryFn: () => companyService.getAllCompanies(page, limit, filters),
        staleTime: 5 * 60 * 1000, // Cache 5 phút
    });
};

// Hook lấy chi tiết company
export const useCompany = (id: string) => {
    return useQuery({
        queryKey: ['company', id],
        queryFn: () => companyService.getCompanyById(id),
        enabled: !!id, // Chỉ fetch khi có id
    });
};

// Hook tạo company mới
export const useCreateCompany = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateCompanyDto) => companyService.createCompany(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['companies'] });
        },
    });
};

// Hook cập nhật company
export const useUpdateCompany = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateCompanyDto) => companyService.updateCompany(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['companies'] });
        },
    });
};

// Hook xóa company
export const useDeleteCompany = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => companyService.deleteCompany(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['companies'] });
        },
    });
};
