import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { JwtResponse, LoginRequest, RegisterRequest } from '../models/auth.model';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:8080/api/auth';
    private isBrowser: boolean;

    constructor(
        private http: HttpClient,
        private router: Router,
        @Inject(PLATFORM_ID) platformId: Object
    ) {
        this.isBrowser = isPlatformBrowser(platformId);
    }

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
        if (!this.isBrowser) {
            return false;
        }
        return !!localStorage.getItem('token');
    }

    getToken(): string | null {
        if (!this.isBrowser) {
            return null;
        }
        return localStorage.getItem('token');
    }

    getUsername(): string | null {
        if (!this.isBrowser) {
            return null;
        }
        return localStorage.getItem('username');
    }
}
