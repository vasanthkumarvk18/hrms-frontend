import { inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const loginGuard = (): boolean | UrlTree => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isLoggedIn()) {
        return router.createUrlTree(['/employees']);
    }

    return true;
};
