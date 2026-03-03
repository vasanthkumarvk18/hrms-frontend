import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

interface HrAttendanceReport {
    date: string;
    employeeName: string;
    workingHours: number;
    lateMark: boolean;
    overtime: number;
}

@Component({
    selector: 'app-hr-report',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './hr-report.component.html',
    styleUrls: ['./hr-report.component.css']
})
export class HrReportComponent {
    private http = inject(HttpClient);
    private authService = inject(AuthService);

    fromDate: string = '';
    toDate: string = '';
    reportData: HrAttendanceReport[] = [];
    loading: boolean = false;
    error: string | null = null;

    constructor() {
        // Set default dates to current month
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        this.fromDate = this.formatDate(firstDay);
        this.toDate = this.formatDate(now);
    }

    private formatDate(date: Date): string {
        return date.toISOString().split('T')[0];
    }

    search() {
        if (!this.fromDate || !this.toDate) {
            this.error = 'Please select both from and to dates.';
            return;
        }

        this.loading = true;
        this.error = null;
        this.reportData = [];

        const token = this.authService.getToken();

        // Explicitly setting headers as requested, 
        // though the authInterceptor also handles this.
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        const params = new HttpParams()
            .set('fromDate', this.fromDate)
            .set('toDate', this.toDate);

        this.http.get<HrAttendanceReport[]>('http://localhost:8080/api/attendance/hr-report', { headers, params })
            .subscribe({
                next: (data) => {
                    this.reportData = data;
                    this.loading = false;
                    if (data.length === 0) {
                        this.error = 'No attendance records found for the selected period.';
                    }
                },
                error: (err) => {
                    console.error('Error fetching HR report:', err);
                    this.error = 'Failed to fetch the attendance report. Please check if the backend is running.';
                    this.loading = false;
                }
            });
    }

    exportToCsv() {
        if (this.reportData.length === 0) return;

        const headers = ['Date', 'Employee Name', 'Working Hours', 'Late Mark', 'Overtime'];
        const csvContent = [
            headers.join(','),
            ...this.reportData.map(row => [
                row.date,
                `"${row.employeeName}"`,
                row.workingHours,
                row.lateMark ? 'Yes' : 'No',
                row.overtime
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `HR_Attendance_Report_${this.fromDate}_to_${this.toDate}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
