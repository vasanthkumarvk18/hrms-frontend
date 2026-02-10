import { Component } from '@angular/core';

@Component({
    selector: 'app-loading',
    standalone: true,
    template: `
    <div class="loading-container">
      <div class="spinner"></div>
    </div>
  `,
    styles: [`
    .loading-container {
      height: 100vh;
      width: 100vw;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8f9fa;
      position: fixed;
      top: 0;
      left: 0;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #e5e7eb;
      border-top-color: #6366f1;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `]
})
export class LoadingComponent { }
