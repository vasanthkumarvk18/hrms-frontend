export interface Employee {
    employeeCode: string;
    firstName: string;
    email: string;
    status: 'ACTIVE' | 'EXITED';
}

export interface EmployeeCreateRequest {
    employeeCode?: string;
    firstName: string;
    lastName: string;
    gender?: string;
    dob?: string;
    email: string;
    mobile: string;
    departmentId: number;
    designationId: number;
    managerId?: number;
    dateOfJoining: string;
    employmentType?: string;
    maritalStatus?: string;
    bloodGroup?: string;
    profilePhotoUrl?: string;
    probationEndDate?: string;
}

export interface EmployeeResponse {
    id?: number;
    employeeCode: string;
    firstName: string;
    lastName?: string;
    email: string;
    mobile?: string;
    gender?: string;
    dob?: string;
    departmentId?: number;
    designationId?: number;
    managerId?: number;
    dateOfJoining?: string;
    probationEndDate?: string;
    employmentType?: string;
    status: string;
    maritalStatus?: string;
    bloodGroup?: string;
    profilePhotoUrl?: string;
    createdAt?: string;
}
