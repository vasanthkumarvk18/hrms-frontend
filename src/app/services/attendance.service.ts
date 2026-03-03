import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Attendance, DailySummary, MonthlySummary } from '../models/attendance.model';

@Injectable({
    providedIn: 'root'
})
export class AttendanceService {
    private apiUrl = 'http://localhost:8080/api/attendance';

    constructor(private http: HttpClient) { }

    // Check-in
    // checkIn(employeeCode: string): Observable<Attendance> {
    //     return this.http.post<Attendance>(`${this.apiUrl}/check-in/${employeeCode}`, {});
    // }
    checkIn(employeeCode: string, workLocation: string): Observable<Attendance> {
        const url = `${this.apiUrl}/check-in?workLocation=${workLocation}`;
        console.log('Checking in at:', url);
        return this.http.post<Attendance>(url, {});
    }

    // Check-out
    checkOut(employeeCode: string): Observable<Attendance> {
        const url = `${this.apiUrl}/check-out`;
        console.log('Checking out at:', url);
        return this.http.post<Attendance>(url, {});
    }

    // Get attendance history by employee, optionally filtered by date
    getAttendance(employeeCode: string, date?: string): Observable<Attendance[]> {
        let params = new HttpParams();
        if (date) {
            params = params.set('date', date);
        }
        const url = `${this.apiUrl}/${encodeURIComponent(employeeCode)}`;
        console.log('Fetching attendance from:', url);
        return this.http.get<Attendance[]>(url, { params });
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

    // Get HR Attendance Report (for all employees)
    getHrReport(fromDate: string, toDate: string): Observable<any[]> {
        const params = new HttpParams()
            .set('fromDate', fromDate)
            .set('toDate', toDate);
        return this.http.get<any[]>(`${this.apiUrl}/hr-report`, { params });
    }
}
