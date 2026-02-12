import { Component, signal, inject } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { Sidebar } from './components/sidebar/sidebar';
import { Header } from './components/header/header';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar, Header, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private authService = inject(AuthService);
  private router = inject(Router);

  isSidebarCollapsed = signal(false);
  showLayout = signal(false);

  constructor() {
    // Initial layout check
    this.updateLayout();

    // Update layout on every navigation
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateLayout();
    });
  }

  private updateLayout(): void {
    // Show layout only if user is logged in
    this.showLayout.set(this.authService.isLoggedIn());
  }

  onSidebarToggle(isCollapsed: boolean) {
    this.isSidebarCollapsed.set(isCollapsed);
  }
}
