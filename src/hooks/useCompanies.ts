import { useQuery } from '@tanstack/react-query';
import { companyService } from '../services/companyService';

export function useCompanies(
    page: number,
    limit: number,
    filters?: {
        search?: string;
        name?: string;
        address?: string;
    }
) {
    return useQuery({
        queryKey: ['companies', page, limit, filters],
        queryFn: () => companyService.getAllCompanies(page, limit, filters),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

export function useCompany(id: string) {
    return useQuery({
        queryKey: ['company', id],
        queryFn: () => companyService.getCompanyById(id),
        enabled: !!id,
    });
}
