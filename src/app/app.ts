import { Component, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { Sidebar } from './components/sidebar/sidebar';
import { Header } from './components/header/header';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar, Header, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('hrms-frontend');
  isSidebarCollapsed = false;
  showLayout = true;

  constructor(private router: Router) {
    // Check current route to show/hide layout
    this.updateLayout(this.router.url);

    // Update layout when route changes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateLayout(event.urlAfterRedirects);
      }
    });
  }

  private updateLayout(url: string): void {
    // Hide sidebar and header on login/register pages
    this.showLayout = !this.isAuthRoute(url);
  }

  private isAuthRoute(url: string): boolean {
    return url.includes('/login') || url.includes('/register');
  }

  onSidebarToggle(isCollapsed: boolean) {
    this.isSidebarCollapsed = isCollapsed;
  }
}

