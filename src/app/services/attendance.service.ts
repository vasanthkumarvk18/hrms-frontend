import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Attendance, DailySummary, MonthlySummary } from '../models/attendance.model';

@Injectable({
    providedIn: 'root'
})
export class AttendanceService {
    private apiUrl = 'http://localhost:8080/attendance';

    constructor(private http: HttpClient) { }

    // Check-in
    checkIn(employeeCode: string): Observable<Attendance> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this.http.post<Attendance>(`${this.apiUrl}/check-in/${employeeCode}`, {}, { headers });
    }

    // Check-out
    checkOut(employeeCode: string): Observable<Attendance> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this.http.post<Attendance>(`${this.apiUrl}/check-out/${employeeCode}`, {}, { headers });
    }

    // Get attendance history by employee
    getAttendance(employeeCode: string): Observable<Attendance[]> {
        return this.http.get<Attendance[]>(`${this.apiUrl}/${employeeCode}`);
    }

    // Get daily summary
    getDailySummary(employeeCode: string, date: string): Observable<DailySummary> {
        const params = new HttpParams()
            .set('employeeCode', employeeCode)
            .set('date', date);
        return this.http.get<DailySummary>(`${this.apiUrl}/summary`, { params });
    }

    // Get monthly summary
    getMonthlySummary(employeeCode: string, year: number, month: number): Observable<MonthlySummary> {
        const params = new HttpParams()
            .set('employeeCode', employeeCode)
            .set('year', year.toString())
            .set('month', month.toString());
        return this.http.get<MonthlySummary>(`${this.apiUrl}/monthly-summary`, { params });
    }
}
