import { Component, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  badge?: number;
  expanded?: boolean;
  children?: MenuItem[];
  roles?: string[];
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
  isCollapsed = false;

  @Output() sidebarToggled = new EventEmitter<boolean>();

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'home',
      expanded: false,
      children: [
        { label: 'Overview', icon: '', route: '/dashboard/overview' },
        { label: 'Quick Stats', icon: '', route: '/dashboard/stats', roles: ['ADMIN', 'HR', 'MANAGER', 'TEAM_LEAD'] },
        { label: 'Today Activity', icon: '', route: '/dashboard/activity', roles: ['ADMIN', 'HR', 'MANAGER', 'TEAM_LEAD'] }
      ]
    },
    {
      label: 'Employees',
      icon: 'people',
      expanded: false,
      children: [
        { label: 'Employee List', icon: '', route: '/employees', roles: ['ADMIN', 'HR', 'MANAGER', 'TEAM_LEAD'] },
        { label: 'Departments', icon: '', route: '/employees/departments', roles: ['ADMIN', 'HR'] },
        { label: 'Designations', icon: '', route: '/employees/designation', roles: ['ADMIN', 'HR'] },
        { label: 'Employee Documents', icon: '', route: '/employees/documents', roles: ['ADMIN', 'HR'] }
      ],
      roles: ['ADMIN', 'HR', 'MANAGER', 'TEAM_LEAD']
    },
    {
      label: 'Attendance',
      icon: 'schedule',
      expanded: false,
      children: [
        { label: 'Attendance Dashboard', icon: '', route: '/attendance' },
        // { label: 'Shift Management', icon: '', route: '/attendance/shifts' },
        // { label: 'Timesheets', icon: '', route: '/attendance/timesheets' },
        // { label: 'Overtime', icon: '', route: '/attendance/overtime' }
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
        { label: 'Salary Structure', icon: '', route: '/payroll/structure', roles: ['ADMIN', 'HR', 'PAYROLL_EXECUTIVE'] },
        { label: 'Payslips', icon: '', route: '/payroll/payslips' },
        { label: 'Reimbursements', icon: '', route: '/payroll/reimbursements' },
        { label: 'Bonuses', icon: '', route: '/payroll/bonuses' },
        { label: 'Tax / Deductions', icon: '', route: '/payroll/tax' }
      ],
      roles: ['ADMIN', 'HR', 'PAYROLL_EXECUTIVE']
    },
    {
      label: 'Schedule',
      icon: 'event',
      expanded: false,
      children: [
        { label: 'Shift Planner', icon: '', route: '/schedule/planner', roles: ['ADMIN', 'HR', 'MANAGER', 'TEAM_LEAD'] },
        { label: 'Work Calendar', icon: '', route: '/schedule/calendar' },
        { label: 'Assign Shifts', icon: '', route: '/schedule/assign', roles: ['ADMIN', 'HR', 'MANAGER'] }
      ],
      roles: ['ADMIN', 'HR', 'MANAGER', 'TEAM_LEAD']
    },
    {
      label: 'Reports',
      icon: 'assessment',
      expanded: false,
      children: [
        { label: 'Attendance Reports', icon: '', route: '/reports/attendance', roles: ['ADMIN', 'HR', 'MANAGER', 'TEAM_LEAD'] },
        { label: 'Leave Reports', icon: '', route: '/reports/leave', roles: ['ADMIN', 'HR', 'MANAGER', 'TEAM_LEAD'] },
        { label: 'Payroll Reports', icon: '', route: '/reports/payroll', roles: ['ADMIN', 'HR', 'PAYROLL_EXECUTIVE'] },
        { label: 'Employee Reports', icon: '', route: '/reports/employee', roles: ['ADMIN', 'HR', 'MANAGER'] }
      ],
      roles: ['ADMIN', 'HR', 'MANAGER', 'TEAM_LEAD', 'PAYROLL_EXECUTIVE']
    },
    {
      label: 'IT Support',
      icon: 'support_agent',
      expanded: false,
      children: [
        { label: 'System Health', icon: '', route: '/it/health' },
        { label: 'Asset Management', icon: '', route: '/it/assets' }
      ],
      roles: ['ADMIN', 'IT_SUPPORT']
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
      ],
      roles: ['ADMIN']
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

  filteredMenuItemsList: MenuItem[] = [];
  filteredBottomMenuItemsList: MenuItem[] = [];

  constructor(private router: Router, public authService: AuthService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.refreshMenu();
  }

  refreshMenu(): void {
    const role = this.authService.getRole();

    this.filteredMenuItemsList = this.menuItems.filter(item => {
      const hasAccess = !item.roles || (role && item.roles.includes(role));
      if (!hasAccess) return false;
      if (item.children) {
        return item.children.some(child => !child.roles || (role && child.roles.includes(role)));
      }
      return true;
    });

    this.filteredBottomMenuItemsList = this.bottomMenuItems.filter(item => {
      const hasAccess = !item.roles || (role && item.roles.includes(role));
      if (!hasAccess) return false;
      if (item.children) {
        return item.children.some(child => !child.roles || (role && child.roles.includes(role)));
      }
      return true;
    });

    this.cdr.detectChanges();
  }

  canShowChild(child: MenuItem): boolean {
    const role = this.authService.getRole();
    const show = !child.roles || (!!role && child.roles.includes(role));
    return show;
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.sidebarToggled.emit(this.isCollapsed);
  }

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
