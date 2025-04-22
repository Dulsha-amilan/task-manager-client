// notification.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificationService, Notification } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-container">
      <div *ngFor="let notification of activeNotifications" 
           class="notification" 
           [ngClass]="notification.type">
        <div class="notification-content">
          <span class="notification-message">{{ notification.message }}</span>
          <button class="close-btn" (click)="removeNotification(notification)">×</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1050;
      max-width: 350px;
    }
    
    .notification {
      margin-bottom: 10px;
      padding: 15px;
      border-radius: 4px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      animation: slideIn 0.3s ease-out;
    }
    
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    .notification-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .close-btn {
      background: none;
      border: none;
      font-size: 18px;
      cursor: pointer;
      margin-left: 10px;
      opacity: 0.7;
    }
    
    .close-btn:hover {
      opacity: 1;
    }
    
    .success {
      background-color: #d4edda;
      border-color: #c3e6cb;
      color: #155724;
    }
    
    .error {
      background-color: #f8d7da;
      border-color: #f5c6cb;
      color: #721c24;
    }
    
    .info {
      background-color: #d1ecf1;
      border-color: #bee5eb;
      color: #0c5460;
    }
    
    .warning {
      background-color: #fff3cd;
      border-color: #ffeeba;
      color: #856404;
    }
  `]
})
export class NotificationComponent implements OnInit, OnDestroy {
  activeNotifications: (Notification & { id: number })[] = [];
  private subscription: Subscription = new Subscription();
  private idCounter = 0;
  
  constructor(private notificationService: NotificationService) {}
  
  ngOnInit(): void {
    this.subscription = this.notificationService.getNotifications()
      .subscribe(notification => {
        this.addNotification(notification);
      });
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  
  addNotification(notification: Notification): void {
    const id = this.idCounter++;
    const newNotification = { ...notification, id };
    this.activeNotifications.push(newNotification);
    
    // Auto-remove notification after duration
    if (notification.duration) {
      setTimeout(() => {
        this.removeNotification(newNotification);
      }, notification.duration);
    }
  }
  
  removeNotification(notification: Notification & { id: number }): void {
    this.activeNotifications = this.activeNotifications.filter(n => n.id !== notification.id);
  }
}