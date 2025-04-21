// login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginModel } from '../../models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class LoginComponent {
  loginModel: LoginModel = {
    username: '',
    password: ''
  };
  errorMessage = '';
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }
  
  login(): void {
    this.errorMessage = '';
    
    this.authService.login(this.loginModel).subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['/tasks']);
        } else {
          this.errorMessage = response.message;
        }
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Login failed';
      }
    });
  }
}