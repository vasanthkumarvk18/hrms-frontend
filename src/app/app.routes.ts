import { Routes } from '@angular/router';
import { EmployeeManagementComponent } from './components/employee-management/employee-management.component';
import { AttendanceDashboardComponent } from './components/attendance-dashboard/attendance-dashboard.component';
import { Designations } from './components/designations/designations';
import { Departments } from './components/departments/departments';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { LogoutComponent } from './components/logout/logout';
import { authGuard } from './guards/auth.guard';
import { loginGuard } from './guards/login.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
    { path: 'register', component: RegisterComponent, canActivate: [loginGuard] },
    { path: 'logout', component: LogoutComponent },
    { path: 'employees', component: EmployeeManagementComponent, canActivate: [authGuard] },
    { path: 'attendance', component: AttendanceDashboardComponent, canActivate: [authGuard] },
    { path: 'employees/designation', component: Designations, canActivate: [authGuard] },
    { path: 'employees/departments', component: Departments, canActivate: [authGuard] }
];

