import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-logout',
    standalone: true,
    template: ''
})
export class LogoutComponent implements OnInit {
    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        // Clear token and redirect to login
        this.authService.logout();
    }
}
