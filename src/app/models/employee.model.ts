export interface Employee {
    employeeId: string;
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
    employeeId: string;
    firstName: string;
    email: string;
    status: string;
}
