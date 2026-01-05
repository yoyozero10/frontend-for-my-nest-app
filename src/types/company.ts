export interface Company {
    _id: string;
    name: string;
    address: string;
    description: string;
    logo?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CompaniesResponse {
    statusCode: number;
    message: string;
    data: {
        meta: {
            page: number;
            limit: number;
            totalItems: number;
            totalPages: number;
        };
        result: Company[];
    };
}

export interface CompanyDetailResponse {
    statusCode: number;
    message: string;
    data: Company;
}

export interface CreateCompanyDto {
    name: string;
    address: string;
    description: string;
    logo?: string;
}

export interface UpdateCompanyDto extends Partial<CreateCompanyDto> {
    _id: string;
}
