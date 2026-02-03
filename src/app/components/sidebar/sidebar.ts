import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  badge?: number;
  expanded?: boolean;
  children?: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  searchQuery = '';

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'home',
      expanded: false,
      children: [
        { label: 'Overview', icon: '', route: '/dashboard/overview' },
        { label: 'Quick Stats', icon: '', route: '/dashboard/stats' },
        { label: 'Today Activity', icon: '', route: '/dashboard/activity' }
      ]
    },
    {
      label: 'Employees',
      icon: 'people',
      expanded: false,
      children: [
        { label: 'Employee List', icon: '', route: '/employees' },
        { label: 'Departments', icon: '', route: '/employees/departments' },
        { label: 'Designations', icon: '', route: '/employees/designations' },
        { label: 'Employee Documents', icon: '', route: '/employees/documents' }
      ]
    },
    {
      label: 'Attendance',
      icon: 'schedule',
      expanded: false,
      children: [
        { label: 'Check-in / Check-out', icon: '', route: '/attendance/checkin' },
        { label: 'Daily Attendance', icon: '', route: '/attendance/daily' },
        { label: 'Shift Management', icon: '', route: '/attendance/shifts' },
        { label: 'Timesheets', icon: '', route: '/attendance/timesheets' },
        { label: 'Overtime', icon: '', route: '/attendance/overtime' }
      ]
    },
    {
      label: 'Leave',
      icon: 'beach_access',
      expanded: false,
      children: [
        { label: 'Apply Leave', icon: '', route: '/leave/apply' },
        { label: 'Leave Requests', icon: '', route: '/leave/requests' },
        { label: 'Leave Balance', icon: '', route: '/leave/balance' },
        { label: 'Leave Policy', icon: '', route: '/leave/policy' },
        { label: 'Holiday Calendar', icon: '', route: '/leave/holidays' }
      ]
    },
    {
      label: 'Payroll',
      icon: 'payments',
      expanded: false,
      children: [
        { label: 'Salary Structure', icon: '', route: '/payroll/structure' },
        { label: 'Payslips', icon: '', route: '/payroll/payslips' },
        { label: 'Reimbursements', icon: '', route: '/payroll/reimbursements' },
        { label: 'Bonuses', icon: '', route: '/payroll/bonuses' },
        { label: 'Tax / Deductions', icon: '', route: '/payroll/tax' }
      ]
    },
    {
      label: 'Schedule',
      icon: 'event',
      expanded: false,
      children: [
        { label: 'Shift Planner', icon: '', route: '/schedule/planner' },
        { label: 'Work Calendar', icon: '', route: '/schedule/calendar' },
        { label: 'Assign Shifts', icon: '', route: '/schedule/assign' }
      ]
    },
    {
      label: 'Reports',
      icon: 'assessment',
      expanded: false,
      children: [
        { label: 'Attendance Reports', icon: '', route: '/reports/attendance' },
        { label: 'Leave Reports', icon: '', route: '/reports/leave' },
        { label: 'Payroll Reports', icon: '', route: '/reports/payroll' },
        { label: 'Employee Reports', icon: '', route: '/reports/employee' }
      ]
    },
    {
      label: 'Tasks / Projects',
      icon: 'task',
      expanded: false,
      children: [
        { label: 'Task Board', icon: '', route: '/tasks/board' },
        { label: 'Project Tracking', icon: '', route: '/tasks/projects' }
      ]
    },
    {
      label: 'Communication',
      icon: 'forum',
      expanded: false,
      children: [
        { label: 'Messages', icon: '', route: '/communication/messages' },
        { label: 'Announcements', icon: '', route: '/communication/announcements' },
        { label: 'Notifications', icon: '', route: '/communication/notifications' }
      ]
    }
  ];

  bottomMenuItems: MenuItem[] = [
    {
      label: 'Settings',
      icon: 'settings',
      expanded: false,
      children: [
        { label: 'Roles & Permissions', icon: '', route: '/settings/roles' },
        { label: 'User Management', icon: '', route: '/settings/users' },
        { label: 'Policies', icon: '', route: '/settings/policies' },
        { label: 'Company Settings', icon: '', route: '/settings/company' },
        { label: 'Integrations', icon: '', route: '/settings/integrations' }
      ]
    },
    {
      label: 'Help',
      icon: 'help_outline',
      expanded: false,
      children: [
        { label: 'Help Center', icon: '', route: '/help/center' },
        { label: 'Support', icon: '', route: '/help/support' }
      ]
    },
    {
      label: 'Log Out',
      icon: 'logout',
      route: '/logout'
    }
  ];

  constructor(private router: Router) { }

  toggleSubmenu(item: MenuItem) {
    if (item.children) {
      item.expanded = !item.expanded;
    }
  }

  navigate(route?: string) {
    if (route) {
      this.router.navigate([route]);
    }
  }

  isActive(route?: string): boolean {
    if (!route) return false;
    return this.router.url === route;
  }
}
