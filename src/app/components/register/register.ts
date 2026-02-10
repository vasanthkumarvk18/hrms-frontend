import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models/auth.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  registerRequest: RegisterRequest = {
    username: '',
    password: '',
    role: 'EMPLOYEE'
  };

  confirmPassword = '';
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;

  roles = [
    { value: 'ADMIN', label: 'Administrator' },
    { value: 'HR', label: 'HR Manager' },
    { value: 'MANAGER', label: 'Manager' },
    { value: 'EMPLOYEE', label: 'Employee' }
  ];

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

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    // Validation
    if (!this.registerRequest.username || !this.registerRequest.password || !this.confirmPassword) {
      this.toastr.error('Please fill in all fields', 'Validation Error');
      return;
    }

    if (this.registerRequest.username.length < 3) {
      this.toastr.error('Username must be at least 3 characters', 'Validation Error');
      return;
    }

    if (this.registerRequest.password.length < 6) {
      this.toastr.error('Password must be at least 6 characters', 'Validation Error');
      return;
    }

    if (this.registerRequest.password !== this.confirmPassword) {
      this.toastr.error('Passwords do not match', 'Validation Error');
      return;
    }

    this.isLoading = true;
    this.authService.register(this.registerRequest).subscribe({
      next: (response) => {
        setTimeout(() => {
          this.isLoading = false;
          this.toastr.success('Registration successful! Please login.', 'Success');
          this.router.navigate(['/login']);
        });
      },
      error: (error) => {
        setTimeout(() => {
          this.isLoading = false;
          this.toastr.error('Registration failed. Username may already exist.', 'Error');
          console.error('Registration error:', error);
        });
      }
    });
  }
}
