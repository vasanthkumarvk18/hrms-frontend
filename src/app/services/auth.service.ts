import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, tap } from 'rxjs';
import { JwtResponse, LoginRequest, RegisterRequest } from '../models/auth.model';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private platformId = inject(PLATFORM_ID);
    private apiUrl = 'http://localhost:8080/api/auth';
    private isBrowser = isPlatformBrowser(this.platformId);


    login(request: LoginRequest): Observable<JwtResponse> {
        return this.http.post<JwtResponse>(`${this.apiUrl}/login`, request).pipe(
            tap(response => {
                if (response.token && this.isBrowser) {
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('username', request.email);

                    // User role directly from response if present, else fallback to token decoding
                    let role = response.role;
                    if (!role) {
                        try {
                            const payload = this.decodeToken(response.token);
                            role = payload?.role;
                        } catch (e) {
                            console.error('Failed to decode role from token', e);
                        }
                    }

                    if (role) {
                        localStorage.setItem('role', role);
                        console.log('User logged in with role:', role);
                    }
                }
            })
        );
    }

    private decodeToken(token: string): any {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) return null;

            const base64Url = parts[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

            const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error('Error decoding JWT token:', e);
            return null;
        }
    }

    register(request: RegisterRequest): Observable<string> {
        return this.http.post(`${this.apiUrl}/register`, request, { responseType: 'text' });
    }

    logout() {
        if (this.isBrowser) {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('role');
        }
        this.router.navigate(['/login']);
    }

    isLoggedIn(): boolean {
        if (!this.isBrowser) return false;
        return !!localStorage.getItem('token');
    }

    getToken(): string | null {
        if (!this.isBrowser) return null;
        return localStorage.getItem('token');
    }

    getUsername(): string | null {
        if (!this.isBrowser) return null;
        return localStorage.getItem('username');
    }

    getRole(): string | null {
        if (!this.isBrowser) return null;
        const role = localStorage.getItem('role');
        return role && role !== 'undefined' ? role : null;
    }

    isAdmin(): boolean {
        return this.getRole() === 'ADMIN';
    }

    isHR(): boolean {
        return this.getRole() === 'HR';
    }

    isManager(): boolean {
        return this.getRole() === 'MANAGER';
    }

    isEmployee(): boolean {
        return this.getRole() === 'EMPLOYEE';
    }

    isTeamLead(): boolean {
        return this.getRole() === 'TEAM_LEAD';
    }

    isPayrollExecutive(): boolean {
        return this.getRole() === 'PAYROLL_EXECUTIVE';
    }

    isITSupport(): boolean {
        return this.getRole() === 'IT_SUPPORT';
    }
}
