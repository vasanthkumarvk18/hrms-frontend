import { Routes } from '@angular/router';
import { EmployeeManagementComponent } from './components/employee-management/employee-management.component';
import { AttendanceDashboardComponent } from './components/attendance-dashboard/attendance-dashboard.component';

export const routes: Routes = [
    { path: '', redirectTo: '/employees', pathMatch: 'full' },
    { path: 'employees', component: EmployeeManagementComponent },
    { path: 'attendance', component: AttendanceDashboardComponent }
];
