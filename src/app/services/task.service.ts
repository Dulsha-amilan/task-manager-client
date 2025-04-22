import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(private http: HttpClient) { }
  
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${environment.apiUrl}/api/Tasks`);
  }
  
  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${environment.apiUrl}/api/Tasks/${id}`);
  }
  
  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(`${environment.apiUrl}/api/Tasks`, task);
  }
  
  updateTask(task: Task): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/api/Tasks/${task.id}`, task);
  }
  
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/api/Tasks/${id}`);
  }
}
