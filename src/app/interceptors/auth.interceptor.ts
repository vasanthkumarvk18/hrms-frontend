import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const toastr = inject(ToastrService);

    const token = authService.getToken();

    if (token) {
        const clonedRequest = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });

        return next(clonedRequest).pipe(
            catchError((error) => {
                if (error.status === 401) {
                    toastr.warning('Your session has expired. Please login again.', 'Session Expired');
                    authService.logout();
                }
                return throwError(() => error);
            })
        );
    }

    return next(req);
};

