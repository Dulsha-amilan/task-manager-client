// app.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';
import { NotificationComponent } from './components/notification/notification.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, NotificationComponent]
})
export class AppComponent implements OnInit {
  currentUser: any;
  
  constructor(private authService: AuthService) {}
  
  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }
  
  logout() {
    this.authService.logout();
  }
}