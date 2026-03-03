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
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
    { path: 'register', component: RegisterComponent, canActivate: [loginGuard] },
    { path: 'logout', component: LogoutComponent },
    {
        path: 'employees',
        component: EmployeeManagementComponent,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN', 'HR', 'MANAGER', 'TEAM_LEAD'] }
    },
    { path: 'attendance', component: AttendanceDashboardComponent, canActivate: [authGuard] },
    {
        path: 'employees/designation',
        component: Designations,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN', 'HR'] }
    },
    {
        path: 'employees/departments',
        component: Departments,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN', 'HR'] }
    }
];

