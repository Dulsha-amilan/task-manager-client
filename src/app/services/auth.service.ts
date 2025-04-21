import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginModel, RegisterModel, AuthResponse } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/auth`;
  
  constructor(private http: HttpClient) { }
  
  login(loginModel: LoginModel): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginModel)
      .pipe(
        tap(response => {
          if (response.success) {
            localStorage.setItem('userId', response.userId.toString());
            localStorage.setItem('username', response.username);
          }
        })
      );
  }
  
  register(registerModel: RegisterModel): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, registerModel);
  }
  
  logout(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
  }
  
  isLoggedIn(): boolean {
    return !!localStorage.getItem('userId');
  }
  
  getUserId(): number {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : 0;
  }
  
  getUsername(): string {
    return localStorage.getItem('username') || '';
  }
}