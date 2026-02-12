import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee, EmployeeCreateRequest, EmployeeResponse } from '../models/employee.model';

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {
    private apiUrl = 'http://localhost:8080/api/employees';

    constructor(private http: HttpClient) { }

    // Create a new employee
    createEmployee(request: EmployeeCreateRequest): Observable<EmployeeResponse> {
        return this.http.post<EmployeeResponse>(this.apiUrl, request);
    }

    // Get all employees (both active and exited)
    getAllEmployees(): Observable<EmployeeResponse[]> {
        return this.http.get<EmployeeResponse[]>(`${this.apiUrl}/all`);
    }

    // Get all active employees
    getActiveEmployees(): Observable<EmployeeResponse[]> {
        return this.http.get<EmployeeResponse[]>(this.apiUrl);
    }

    // Get employee by ID
    getEmployeeById(employeeId: string): Observable<EmployeeResponse> {
        return this.http.get<EmployeeResponse>(`${this.apiUrl}/${employeeId}`);
    }

    // Exit an employee
    exitEmployee(employeeId: string): Observable<string> {
        return this.http.put(`${this.apiUrl}/${employeeId}/exit`, {}, { responseType: 'text' });
    }
}
