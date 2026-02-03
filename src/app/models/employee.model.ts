export interface Employee {
    employeeCode: string;
    firstName: string;
    email: string;
    status: 'ACTIVE' | 'EXITED';
}

export interface EmployeeCreateRequest {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    departmentId: number;
    designationId: number;
    dateOfJoining: string;
}

export interface EmployeeResponse {
    id?: number;
    employeeCode: string;
    firstName: string;
    lastName?: string;
    email: string;
    mobile?: string;
    departmentId?: number;
    designationId?: number;
    dateOfJoining?: string;
    status: string;
}
