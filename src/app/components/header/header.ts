import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
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

  constructor(private router: Router) { }

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
    console.log('Logging out...');
    // Implement logout functionality
  }
}
