import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this.http.post<EmployeeResponse>(this.apiUrl, request, { headers });
    }

    // Get all employees (both active and exited)
    getAllEmployees(): Observable<EmployeeResponse[]> {
        const timestamp = new Date().getTime(); // Cache busting with timestamp
        const headers = new HttpHeaders({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        });
        return this.http.get<EmployeeResponse[]>(`${this.apiUrl}/all?t=${timestamp}`, { headers });
    }

    // Get all active employees
    getActiveEmployees(): Observable<EmployeeResponse[]> {
        const timestamp = new Date().getTime();
        const headers = new HttpHeaders({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        });
        return this.http.get<EmployeeResponse[]>(`${this.apiUrl}?t=${timestamp}`, { headers });
    }

    // Get employee by ID
    getEmployeeById(employeeId: string): Observable<EmployeeResponse> {
        return this.http.get<EmployeeResponse>(`${this.apiUrl}/${employeeId}`);
    }

    // Exit an employee
    exitEmployee(employeeId: string): Observable<string> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        });
        return this.http.put(`${this.apiUrl}/${employeeId}/exit`, {}, {
            headers,
            responseType: 'text'
        });
    }
}
