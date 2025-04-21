// task-form.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class TaskFormComponent implements OnInit {
  task: Task = {
    title: '',
    description: '',
    isCompleted: false,
    dueDate: new Date(),
    userId: 0
  };
  
  isEditMode = false;
  errorMessage = '';
  
  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }
  
  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    
    // Set the user ID
    this.task.userId = this.authService.getUserId();
    
    // Check if we're in edit mode
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadTask(+id);
    }
  }
  
  loadTask(id: number): void {
    this.taskService.getTask(id).subscribe({
      next: (task) => {
        this.task = task;
        // Convert string date to Date object if needed
        if (typeof this.task.dueDate === 'string') {
          this.task.dueDate = new Date(this.task.dueDate);
        }
      },
      error: (error) => {
        this.errorMessage = 'Failed to load task';
        console.error(error);
      }
    });
  }
  
  saveTask(): void {
    this.errorMessage = '';
    
    // Validate form
    if (!this.task.title) {
      this.errorMessage = 'Title is required';
      return;
    }
    
    // Ensure dueDate is in the correct format
    if (typeof this.task.dueDate === 'string') {
      this.task.dueDate = new Date(this.task.dueDate);
    }
    
    // Create a copy of the task with properly formatted date for API
    const taskToSave = {
      ...this.task,
      dueDate: this.formatDateForApi(this.task.dueDate)
    };
    
    if (this.isEditMode) {
      this.taskService.updateTask(taskToSave).subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          this.errorMessage = 'Failed to update task: ' + this.getErrorMessage(error);
          console.error(error);
        }
      });
    } else {
      this.taskService.createTask(taskToSave).subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          this.errorMessage = 'Failed to create task: ' + this.getErrorMessage(error);
          console.error(error);
        }
      });
    }
  }
  
  formatDateForApi(date: Date): string {
    return date.toISOString();
  }
  
  getErrorMessage(error: any): string {
    if (error.error && error.error.message) {
      return error.error.message;
    } else if (error.message) {
      return error.message;
    }
    return 'Unknown error occurred';
  }
  
  cancel(): void {
    this.router.navigate(['/tasks']);
  }
}
