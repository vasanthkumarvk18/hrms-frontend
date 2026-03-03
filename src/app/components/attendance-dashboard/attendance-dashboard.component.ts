import { Component, OnInit, NgZone, ChangeDetectorRef, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AttendanceService } from '../../services/attendance.service';
import { EmployeeService } from '../../services/employee.service';
import { Attendance, DailySummary, MonthlySummary } from '../../models/attendance.model';
import { EmployeeResponse } from '../../models/employee.model';
import { AuthService } from '../../services/auth.service';


@Component({
    selector: 'app-attendance-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './attendance-dashboard.component.html',
    styleUrl: './attendance-dashboard.component.css'
})
export class AttendanceDashboardComponent implements OnInit {
    employeeCode = signal<string>('');
    attendanceHistory: Attendance[] = [];
    isCheckedIn = signal<boolean>(false);
    dailySummary: DailySummary | null = null;
    monthlySummary: MonthlySummary | null = null;
    selectedDate: string = '';
    selectedYear: number = new Date().getFullYear();
    selectedMonth: number = new Date().getMonth() + 1;
    selectedDepartment: string = 'All';
    dashboardSelectedDate: string = '';

    allEmployees: EmployeeResponse[] = [];
    hrReportData: any[] = [];
    isLoadingReport: boolean = false;

    successMessage: string = '';
    errorMessage: string = '';
    isLoadingHistory: boolean = false;
    isLoadingDaily: boolean = false;
    isLoadingMonthly: boolean = false;
    historyFilterDate: string = '';


    currentTime: Date = new Date();
    private timeInterval: any;

    constructor(
        private attendanceService: AttendanceService,
        private employeeService: EmployeeService,
        public authService: AuthService,
        private cdr: ChangeDetectorRef,
        private zone: NgZone,
        private toastr: ToastrService
    ) { }

    // Dashboard Data
    dashboardData = {
        dateRange: '4/28/2023 - 11/30/2023',
        department: 'All',
        employeeDaysAbsent: 0,
        totalEmployees: 0,
        preApprovedAbsences: 0,
        overtimeHours: 0,
        unscheduledDaysLeave: 0,
        employeesOnProbation: 0,
        sickLeave: 0,
        casualLeave: 0,
        employeeDaysPresent: 0,
        attendanceRate: 0,
        absenteeismRate: 0,
        workLocation: {
            home: 45.43,
            office: 54.57
        },
        attendanceByDept: [
            { name: 'Finance', value: 94.74 },
            { name: 'IT', value: 91.01 },
            { name: 'Sales', value: 85.26 },
            { name: 'Human Resources', value: 82.00 },
            { name: 'Marketing', value: 81.33 },
            { name: 'Administration', value: 81.19 },
            { name: 'Customer Support', value: 80.10 },
            { name: 'Accounting', value: 63.54 }
        ]
    };

    ngOnInit(): void {
        this.selectedDate = this.getTodayDate();
        this.dashboardSelectedDate = this.selectedDate;

        // Update time every minute
        this.timeInterval = setInterval(() => {
            this.currentTime = new Date();
            this.cdr.detectChanges();
        }, 1000);

        // Set view based on role
        if (this.authService.isEmployee()) {
            this.showDashboard = false;
            const email = this.authService.getUsername();
            if (email) {
                // Fetch active employees to find the actual employeeCode for this email
                this.employeeService.getActiveEmployees().subscribe({
                    next: (employees) => {
                        this.zone.run(() => {
                            const email = this.authService.getUsername() || '';
                            const me = employees.find(e => e.email === email);
                            if (me) {
                                this.employeeCode.set(me.employeeCode);
                                this.historyFilterDate = this.selectedDate;
                                this.loadAttendanceHistory();
                            } else {
                                this.employeeCode.set(email);
                                this.historyFilterDate = this.selectedDate;
                                this.loadAttendanceHistory();
                            }
                            this.cdr.detectChanges();
                        });
                    },
                    error: () => {
                        this.zone.run(() => {
                            this.employeeCode.set(this.authService.getUsername() || '');
                            this.loadAttendanceHistory();
                            this.cdr.detectChanges();
                        });
                    }
                });
            }
        } else {
            this.showDashboard = true;
            this.loadHrReport();
            this.loadAllEmployees();
        }
    }

    ngOnDestroy(): void {
        if (this.timeInterval) {
            clearInterval(this.timeInterval);
        }
    }

    checkIn(): void {
        if (!this.employeeCode()) return;
        if (this.isCheckedIn()) {
            this.showError('Already checked in!');
            return;
        }
        this.isLoadingHistory = true;
        this.attendanceService.checkIn(this.employeeCode(), 'Office').subscribe({
            next: () => {
                this.showSuccess('Successfully checked in!');
                this.loadAttendanceHistory();
            },
            error: (err) => {
                this.showError('Check-in failed: ' + (err.error?.message || err.message));
                this.isLoadingHistory = false;
            }
        });
    }

    checkOut(): void {
        if (!this.employeeCode()) return;
        if (!this.isCheckedIn()) {
            this.showError('Already checked out!');
            return;
        }
        this.isLoadingHistory = true;
        this.attendanceService.checkOut(this.employeeCode()).subscribe({
            next: () => {
                this.showSuccess('Successfully checked out!');
                this.loadAttendanceHistory();
            },
            error: (err) => {
                this.showError('Check-out failed: ' + (err.error?.message || err.message));
                this.isLoadingHistory = false;
            }
        });
    }

    getTodayDate(): string {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    showDashboard: boolean = true;

    // Called when user clicks search or enters employee code
    onSearch(): void {
        if (!this.employeeCode()) {
            this.showError('Please enter an employee code');
            return;
        }

        this.zone.run(() => {
            this.successMessage = '';
            this.errorMessage = '';

            // Clear previous results for new search
            this.attendanceHistory = [];
            this.dailySummary = null;
            this.monthlySummary = null;

            this.showDashboard = false; // Switch to individual view
            this.selectedDate = this.getTodayDate(); // Ensure it's today
            this.historyFilterDate = this.selectedDate; // Default filter to today
            this.loadAttendanceHistory();
            this.cdr.detectChanges();
        });
    }

    backToDashboard(): void {
        this.showDashboard = true;
        this.employeeCode.set('');
        this.dailySummary = null;
        this.monthlySummary = null;
        this.attendanceHistory = [];
    }

    get filteredHistory(): Attendance[] {
        if (!this.historyFilterDate) {
            return this.attendanceHistory;
        }
        return this.attendanceHistory.filter(record => {
            if (!record.date) return false;
            return record.date.substring(0, 10) === this.historyFilterDate;
        });
    }

    // We'll use individual flags instead of startRequest/finishRequest


    onRefresh(): void {
        this.loadAttendanceHistory();
        this.loadHrReport();
    }

    loadHrReport(): void {
        this.isLoadingReport = true;
        // Fetch report for the date chosen in the dashboard
        this.attendanceService.getHrReport(this.dashboardSelectedDate, this.dashboardSelectedDate).subscribe({
            next: (data) => {
                this.hrReportData = data;
                this.isLoadingReport = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error fetching HR report:', err);
                this.isLoadingReport = false;
                this.cdr.detectChanges();
            }
        });
    }

    loadAllEmployees(): void {
        this.employeeService.getActiveEmployees().subscribe({
            next: (data) => {
                this.allEmployees = data;
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error loading employees:', err)
        });
    }

    get totalEmployeeCount(): number {
        if (!this.allEmployees || this.allEmployees.length === 0) return 0;

        if (this.selectedDepartment === 'All') {
            return this.allEmployees.length;
        } else {
            // Filter allEmployees by department. 
            // We'll check for 'department' string first, then fallback to mapping departmentId if needed
            return this.allEmployees.filter((e: any) => {
                const dept = e.department || this.getDeptNameById(e.departmentId);
                return dept === this.selectedDepartment;
            }).length;
        }
    }

    private getDeptNameById(id: number | undefined): string {
        if (!id) return '';
        const map: { [key: number]: string } = {
            1: 'IT',
            2: 'Human Resources',
            3: 'Finance',
            4: 'Marketing',
            5: 'Operations'
        };
        return map[id] || '';
    }

    get presentEmployeeCount(): number {
        if (!this.allEmployees || this.allEmployees.length === 0) return 0;

        // Count employees in filteredHrReport who are marked as present
        return this.filteredHrReport.filter(r => r.isPresent).length;
    }

    get absentEmployeeCount(): number {
        return Math.max(0, this.totalEmployeeCount - this.presentEmployeeCount);
    }

    get homeWorkCount(): number {
        // Count present employees who are explicitly assigned to 'Home' or 'HOME'
        return this.filteredHrReport.filter(r =>
            r.isPresent && (r.workLocation === 'HOME' || r.workLocation === 'Home')
        ).length;
    }

    get officeWorkCount(): number {
        // Anyone present who isn't explicitly 'Home' is counted as 'Office'
        const totalPresent = this.presentEmployeeCount;
        const home = this.homeWorkCount;
        return Math.max(0, totalPresent - home);
    }

    get locationPercentages(): { home: number, office: number } {
        const total = this.presentEmployeeCount;
        if (total === 0) return { home: 0, office: 0 };
        return {
            home: (this.homeWorkCount / total) * 100,
            office: (this.officeWorkCount / total) * 100
        };
    }

    get attendanceRate(): number {
        const total = this.totalEmployeeCount;
        if (total === 0) return 0;
        const present = this.presentEmployeeCount;
        return Number(((present / total) * 100).toFixed(2));
    }

    get absenteeismRate(): number {
        const total = this.totalEmployeeCount;
        if (total === 0) return 0;
        const absent = this.absentEmployeeCount;
        return Number(((absent / total) * 100).toFixed(2));
    }

    get donutBackground(): string {
        const total = this.presentEmployeeCount;
        if (total === 0) {
            return '#fff1f2'; // Very light red/pink for empty state
        }
        return `conic-gradient(#9f1239 0% ${this.locationPercentages.office}%, #f87171 ${this.locationPercentages.office}% 100%)`;
    }

    get filteredHrReport(): any[] {
        if (!this.allEmployees || this.allEmployees.length === 0) return this.hrReportData;

        // 1. Create a map of existing records from hrReportData for quick lookup
        const reportMap = new Map();
        this.hrReportData.forEach(r => {
            if (!reportMap.has(r.employeeName) || r.workingHours > reportMap.get(r.employeeName).workingHours) {
                reportMap.set(r.employeeName, r);
            }
        });

        // 2. Map all employees to their corresponding report record or a pseudo-absent record
        const completeReport = this.allEmployees.map(emp => {
            const fullName = `${emp.firstName} ${emp.lastName || ''}`.trim();
            const existingRecord = reportMap.get(fullName);

            if (existingRecord) {
                // If a record exists in the HR report, they have checked in.
                return {
                    ...existingRecord,
                    isPresent: true
                };
            } else {
                return {
                    employeeName: fullName,
                    date: this.dashboardSelectedDate || this.getTodayDate(),
                    workingHours: 0,
                    lateMark: false,
                    overtime: 0,
                    department: (emp as any).department || this.getDeptNameById(emp.departmentId),
                    isPresent: false
                };
            }
        });

        if (this.selectedDepartment === 'All') return completeReport;
        return completeReport.filter(record => record.department === this.selectedDepartment);
    }


    loadAttendanceHistory(): void {
        if (!this.employeeCode()) return;
        this.isLoadingHistory = true;

        this.attendanceService.getAttendance(this.employeeCode(), this.historyFilterDate).subscribe({
            next: (response) => {
                this.zone.run(() => {
                    // Sort history: newest date and session first
                    this.attendanceHistory = (response ?? []).sort((a, b) => {
                        const dateA = a.date || '';
                        const dateB = b.date || '';
                        if (dateA !== dateB) return dateB.localeCompare(dateA);
                        return (b.sessionNo || 0) - (a.sessionNo || 0);
                    });

                    // Update check-in status based on the latest record
                    if (this.attendanceHistory.length > 0) {
                        const latest = this.attendanceHistory[0];
                        // If there is a check-in but no check-out, they are checked in
                        this.isCheckedIn.set(!!latest.checkIn && !latest.checkOut);
                    } else {
                        this.isCheckedIn.set(false);
                    }

                    this.isLoadingHistory = false;
                    this.cdr.detectChanges();
                });
            },
            error: (error) => {
                this.zone.run(() => {
                    console.error('Error:', error);
                    this.isLoadingHistory = false;
                    this.cdr.detectChanges();
                });
            }
        });
    }

    loadDailySummary(): void {
        if (!this.employeeCode() || !this.selectedDate) {
            this.showError('Please enter employee code and select a date');
            return;
        }

        this.isLoadingDaily = true;
        this.attendanceService.getDailySummary(this.employeeCode(), this.selectedDate).subscribe({
            next: (response) => {
                this.zone.run(() => {
                    this.dailySummary = { ...response };
                    this.isLoadingDaily = false;
                    this.cdr.detectChanges();
                });
            },
            error: (error) => {
                this.zone.run(() => {
                    this.showError('Failed to load daily summary: ' + (error.error?.message || error.message));
                    this.isLoadingDaily = false;
                    this.cdr.detectChanges();
                });
            }
        });
    }

    loadMonthlySummary(): void {
        if (!this.employeeCode()) {
            this.showError('Please enter an employee code');
            return;
        }

        this.isLoadingMonthly = true;
        this.attendanceService.getMonthlySummary(this.employeeCode(), this.selectedYear, this.selectedMonth).subscribe({
            next: (response) => {
                this.zone.run(() => {
                    this.monthlySummary = { ...response };
                    this.isLoadingMonthly = false;
                    this.cdr.detectChanges();
                });
            },
            error: (error) => {
                this.zone.run(() => {
                    this.showError('Failed to load monthly summary: ' + (error.error?.message || error.message));
                    this.isLoadingMonthly = false;
                    this.cdr.detectChanges();
                });
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
        this.toastr.success(message);
    }

    showError(message: string): void {
        this.toastr.error(message);
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
