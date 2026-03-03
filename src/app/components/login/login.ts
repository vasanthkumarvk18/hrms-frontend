import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/auth.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  loginRequest: LoginRequest = {
    email: '',
    password: ''
  };

  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (!this.loginRequest.email || !this.loginRequest.password) {
      this.toastr.error('Please fill in all fields', 'Validation Error');
      return;
    }

    this.authService.login(this.loginRequest).subscribe({
      next: () => {
        this.toastr.success('Login successful!', 'Welcome');

        // Navigate based on role after login
        const role = this.authService.getRole();
        if (role === 'EMPLOYEE') {
          this.router.navigate(['/attendance']);
        } else {
          this.router.navigate(['/employees']);
        }
      },
      error: (error) => {
        console.error('Login Failed Detailed Error:', error);
        const errorMsg = error.error?.message || error.error || 'Invalid email or password';
        this.toastr.error(errorMsg, 'Login Failed');
      }
    });
  }
}
