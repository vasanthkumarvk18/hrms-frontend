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
    username: '',
    password: ''
  };

  isLoading = false;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    // Guard handles redirect if already logged in
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (!this.loginRequest.username || !this.loginRequest.password) {
      this.toastr.error('Please fill in all fields', 'Validation Error');
      return;
    }

    this.isLoading = true;
    this.authService.login(this.loginRequest).subscribe({
      next: (response) => {
        setTimeout(() => {
          this.isLoading = false;
          this.toastr.success('Login successful!', 'Welcome');
          this.router.navigate(['/employees']);
        });
      },
      error: (error) => {
        setTimeout(() => {
          this.isLoading = false;
          this.toastr.error('Invalid username or password', 'Login Failed');
          console.error('Login error:', error);
        });
      }
    });
  }
}
