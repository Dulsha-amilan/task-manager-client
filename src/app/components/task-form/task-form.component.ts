import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
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
    
    if (this.isEditMode) {
      this.taskService.updateTask(this.task).subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          this.errorMessage = 'Failed to update task';
          console.error(error);
        }
      });
    } else {
      this.taskService.createTask(this.task).subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          this.errorMessage = 'Failed to create task';
          console.error(error);
        }
      });
    }
  }
  
  cancel(): void {
    this.router.navigate(['/tasks']);
  }
  
  // Helper for date input format
  formatDateForInput(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
}