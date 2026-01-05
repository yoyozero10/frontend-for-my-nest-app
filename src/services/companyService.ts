import axiosInstance from '../lib/axios';
import type {
    Company,
    CompaniesResponse,
    CompanyDetailResponse,
    CreateCompanyDto,
    UpdateCompanyDto
} from '../types/company';

export const companyService = {
    // Lấy danh sách companies với pagination và filters
    async getAllCompanies(page = 1, limit = 12, filters?: {
        search?: string;
        name?: string;
        address?: string;
    }): Promise<CompaniesResponse> {
        const params = new URLSearchParams({
            current: page.toString(),
            pageSize: limit.toString(),
        });

        if (filters?.search) params.append('search', filters.search);
        if (filters?.name) params.append('name', filters.name);
        if (filters?.address) params.append('address', filters.address);

        const response = await axiosInstance.get<CompaniesResponse>(
            `/companies?${params.toString()}`
        );
        return response.data;
    },

    // Lấy chi tiết company theo ID
    async getCompanyById(id: string): Promise<CompanyDetailResponse> {
        const response = await axiosInstance.get<CompanyDetailResponse>(
            `/companies/${id}`
        );
        return response.data;
    },

    // Tạo company mới (HR/Admin only)
    async createCompany(data: CreateCompanyDto): Promise<any> {
        const response = await axiosInstance.post('/companies', data);
        return response.data;
    },

    // Cập nhật company (HR/Admin only)
    async updateCompany(data: UpdateCompanyDto): Promise<any> {
        const response = await axiosInstance.patch('/companies', data);
        return response.data;
    },

    // Xóa company (HR/Admin only)
    async deleteCompany(id: string): Promise<any> {
        const response = await axiosInstance.delete(`/companies/${id}`);
        return response.data;
    },
};
