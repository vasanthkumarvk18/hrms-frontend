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
                    localStorage.setItem('username', request.username);
                }
            })
        );
    }

    register(request: RegisterRequest): Observable<string> {
        return this.http.post(`${this.apiUrl}/register`, request, { responseType: 'text' });
    }

    logout() {
        if (this.isBrowser) {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
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
}
