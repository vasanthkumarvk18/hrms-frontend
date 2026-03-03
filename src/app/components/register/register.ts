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
    email: '',
    password: '',
    role: 'EMPLOYEE'
  };

  confirmPassword = '';
  showPassword = false;
  showConfirmPassword = false;

  roles = [
    { value: 'EMPLOYEE', label: 'Employee' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    // Validation
    if (!this.registerRequest.email || !this.registerRequest.password || !this.confirmPassword) {
      this.toastr.error('Please fill in all fields', 'Validation Error');
      return;
    }

    if (this.registerRequest.email.length < 3) {
      this.toastr.error('Email must be at least 3 characters', 'Validation Error');
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

    this.authService.register(this.registerRequest).subscribe({
      next: (response) => {
        this.toastr.success('Registration successful! Please login.', 'Success');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.toastr.error('Registration failed. Email may already exist.', 'Error');
        console.error('Registration error:', error);
      }
    });
  }
}
