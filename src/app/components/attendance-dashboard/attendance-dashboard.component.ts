import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AttendanceService } from '../../services/attendance.service';
import { Attendance, DailySummary, MonthlySummary } from '../../models/attendance.model';

@Component({
    selector: 'app-attendance-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './attendance-dashboard.component.html',
    styleUrl: './attendance-dashboard.component.css'
})
export class AttendanceDashboardComponent implements OnInit {
    employeeCode: string = '';
    attendanceHistory: Attendance[] = [];
    dailySummary: DailySummary | null = null;
    monthlySummary: MonthlySummary | null = null;
    selectedDate: string = '';
    selectedYear: number = new Date().getFullYear();
    selectedMonth: number = new Date().getMonth() + 1;

    successMessage: string = '';
    errorMessage: string = '';
    loading: boolean = false;

    constructor(private attendanceService: AttendanceService) { }

    ngOnInit(): void {
        this.selectedDate = this.getTodayDate();
    }

    getTodayDate(): string {
        const today = new Date();
        return today.toISOString().split('T')[0];
    }

    checkIn(): void {
        console.log('Check-in button clicked! Employee Code:', this.employeeCode);

        if (!this.employeeCode) {
            this.showError('Please enter an employee code');
            return;
        }

        this.loading = true;
        console.log('Calling attendance service check-in...');
        this.attendanceService.checkIn(this.employeeCode).subscribe({
            next: (response) => {
                console.log('Check-in successful:', response);
                this.showSuccess('Checked in successfully!');
                this.loading = false;
                this.loadAttendanceHistory();
            },
            error: (error) => {
                console.error('Check-in error:', error);
                let errorMessage = 'Check-in failed: ';

                if (error.status === 0) {
                    errorMessage += 'Cannot connect to server. Please ensure backend is running on http://localhost:8080';
                } else if (error.error?.message) {
                    errorMessage += error.error.message;
                } else if (error.message) {
                    errorMessage += error.message;
                } else if (error.error) {
                    errorMessage += typeof error.error === 'string' ? error.error : JSON.stringify(error.error);
                } else {
                    errorMessage += `Server error (${error.status})`;
                }

                this.showError(errorMessage);
                this.loading = false;
            }
        });
    }

    checkOut(): void {
        console.log('Check-out button clicked! Employee Code:', this.employeeCode);

        if (!this.employeeCode) {
            this.showError('Please enter an employee code');
            return;
        }

        this.loading = true;
        console.log('Calling attendance service check-out...');
        this.attendanceService.checkOut(this.employeeCode).subscribe({
            next: (response) => {
                console.log('Check-out successful:', response);
                this.showSuccess('Checked out successfully!');
                this.loading = false;
                this.loadAttendanceHistory();
            },
            error: (error) => {
                console.error('Check-out error:', error);
                let errorMessage = 'Check-out failed: ';

                if (error.status === 0) {
                    errorMessage += 'Cannot connect to server. Please ensure backend is running on http://localhost:8080';
                } else if (error.error?.message) {
                    errorMessage += error.error.message;
                } else if (error.message) {
                    errorMessage += error.message;
                } else if (error.error) {
                    errorMessage += typeof error.error === 'string' ? error.error : JSON.stringify(error.error);
                } else {
                    errorMessage += `Server error (${error.status})`;
                }

                this.showError(errorMessage);
                this.loading = false;
            }
        });
    }

    loadAttendanceHistory(): void {
        if (!this.employeeCode) {
            console.log('No employee code, skipping history load');
            return;
        }

        console.log('Loading attendance history for:', this.employeeCode);
        this.attendanceService.getAttendance(this.employeeCode).subscribe({
            next: (response) => {
                console.log('Attendance history loaded:', response);
                this.attendanceHistory = response ?? [];
            },
            error: (error) => {
                console.error('Failed to load attendance history:', error);
            }
        });
    }

    loadDailySummary(): void {
        if (!this.employeeCode || !this.selectedDate) {
            this.showError('Please enter employee code and select a date');
            return;
        }

        this.loading = true;
        this.attendanceService.getDailySummary(this.employeeCode, this.selectedDate).subscribe({
            next: (response) => {
                this.dailySummary = response;
                this.loading = false;
            },
            error: (error) => {
                this.showError('Failed to load daily summary: ' + (error.error?.message || error.message));
                this.loading = false;
            }
        });
    }

    loadMonthlySummary(): void {
        if (!this.employeeCode) {
            this.showError('Please enter an employee code');
            return;
        }

        this.loading = true;
        this.attendanceService.getMonthlySummary(this.employeeCode, this.selectedYear, this.selectedMonth).subscribe({
            next: (response) => {
                this.monthlySummary = response;
                this.loading = false;
            },
            error: (error) => {
                this.showError('Failed to load monthly summary: ' + (error.error?.message || error.message));
                this.loading = false;
            }
        });
    }

    formatTime(time: string | undefined): string {
        if (!time) return 'N/A';
        return time;
    }

    formatDate(date: string | undefined): string {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString();
    }

    showSuccess(message: string): void {
        this.successMessage = message;
        this.errorMessage = '';
        setTimeout(() => this.successMessage = '', 3000);
    }

    showError(message: string): void {
        this.errorMessage = message;
        this.successMessage = '';
        setTimeout(() => this.errorMessage = '', 10000);
    }

    formatLabel(key: string): string {
        return key.replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase());
    }

    getStatusClass(status?: string | null): string {
        if (!status) return 'status-in-progress';
        const statusLower = status.toLowerCase().replace(/_/g, '-');
        return `status-${statusLower}`;
    }

    getStatusIconClass(status: string): string {
        if (!status) return '';
        if (status.includes('HALF')) return 'half-day';
        if (status.includes('ABSENT')) return 'absent';
        return '';
    }
}
