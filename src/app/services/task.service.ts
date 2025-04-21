import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/api/tasks`;
  
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }
  
  getTasks(): Observable<Task[]> {
    const userId = this.authService.getUserId();
    return this.http.get<Task[]>(`${this.apiUrl}/${userId}`);
  }
  
  getTask(id: number): Observable<Task> {
    const userId = this.authService.getUserId();
    return this.http.get<Task>(`${this.apiUrl}/${userId}/${id}`);
  }
  
  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}`, task);
  }
  
  updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${task.id}`, task);
  }
  
  deleteTask(id: number): Observable<void> {
    const userId = this.authService.getUserId();
    return this.http.delete<void>(`${this.apiUrl}/${userId}/${id}`);
  }
}