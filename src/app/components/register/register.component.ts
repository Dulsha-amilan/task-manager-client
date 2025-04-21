import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterModel } from '../../models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerModel: RegisterModel = {
    username: '',
    password: ''
  };
  errorMessage = '';
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }
  
  register(): void {
    this.errorMessage = '';
    
    this.authService.register(this.registerModel).subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['/login']);
        } else {
          this.errorMessage = response.message;
        }
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Registration failed';
      }
    });
  }
}