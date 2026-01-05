export interface Job {
    _id: string;
    name: string;
    skills: string[];
    company: {
        _id: string;
        name: string;
        logo?: string;
    };
    location: string;
    salary: number;
    quantity: number;
    level: 'INTERN' | 'FRESHER' | 'JUNIOR' | 'MIDDLE' | 'SENIOR';
    description: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateJobDto {
    name: string;
    skills: string[];
    company: string; // company ID
    location: string;
    salary: number;
    quantity: number;
    level: string;
    description: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
}

export interface UpdateJobDto extends Partial<CreateJobDto> { }

export interface JobsResponse {
    statusCode: number;
    message: string;
    data: {
        result: Job[];
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        };
    };
}

export interface JobDetailResponse {
    statusCode: number;
    message: string;
    data: Job;
}
