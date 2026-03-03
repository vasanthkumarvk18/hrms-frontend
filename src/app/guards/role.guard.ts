import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

export const roleGuard = (route: ActivatedRouteSnapshot) => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const toastr = inject(ToastrService);

    const expectedRoles = route.data['roles'] as Array<string>;
    const userRole = auth.getRole();

    if (!auth.isLoggedIn()) {
        return router.createUrlTree(['/login']);
    }

    if (!expectedRoles || expectedRoles.length === 0 || (userRole && expectedRoles.includes(userRole))) {
        return true;
    }

    toastr.error('You do not have permission to access this page.', 'Access Denied');
    return router.createUrlTree(['/attendance']); // Redirect to a safe page
};
