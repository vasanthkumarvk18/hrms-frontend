import { Component, Input, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {
  @Input() isSidebarCollapsed = false;
  protected readonly currentUser = signal({
    name: 'John Doe',
    role: 'HR Manager',
    avatar: 'JD'
  });

  protected readonly notifications = signal([
    { id: 1, message: 'New leave request from Sarah Johnson', time: '5 min ago', unread: true },
    { id: 2, message: 'Payroll processing completed', time: '1 hour ago', unread: true },
    { id: 3, message: 'Performance review due for 3 employees', time: '2 hours ago', unread: false }
  ]);

  protected readonly showNotifications = signal(false);
  protected readonly showUserMenu = signal(false);
  protected readonly searchQuery = signal('');

  protected readonly unreadCount = signal(2);

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    // Update user info from auth service
    const username = this.authService.getUsername();
    if (username) {
      const initials = username.substring(0, 2).toUpperCase();
      this.currentUser.set({
        name: username,
        role: 'User',
        avatar: initials
      });
    }
  }

  toggleNotifications(): void {
    this.showNotifications.update(val => !val);
    this.showUserMenu.set(false);
  }

  toggleUserMenu(): void {
    this.showUserMenu.update(val => !val);
    this.showNotifications.set(false);
  }

  closeDropdowns(): void {
    this.showNotifications.set(false);
    this.showUserMenu.set(false);
  }

  onSearch(): void {
    console.log('Searching for:', this.searchQuery());
    // Implement search functionality
  }

  logout(): void {
    this.authService.logout();
  }
}

