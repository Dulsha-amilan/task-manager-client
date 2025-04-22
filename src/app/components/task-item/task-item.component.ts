// task-item.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css'],
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule]
})
export class TaskItemComponent implements OnInit {
  @Input() task!: Task;
  @Output() taskDeleted = new EventEmitter<number>();
  @Output() taskStatusChanged = new EventEmitter<Task>();
  
  loading = false;
  
  constructor(
    private router: Router,
    private taskService: TaskService
  ) { }
  
  ngOnInit(): void {
  }
  
  onEditClick() {
    this.router.navigate(['/tasks', this.task.id, 'edit']);
  }
  
  onDeleteClick() {
    if (confirm('Are you sure you want to delete this task?')) {
      this.loading = true;
      this.taskService.deleteTask(this.task.id!)
        .subscribe({
          next: () => {
            this.taskDeleted.emit(this.task.id);
            this.loading = false;
          },
          error: error => {
            console.error('Error deleting task', error);
            this.loading = false;
          }
        });
    }
  }
  
  onStatusChange(event: Event) {
    const isCompleted = (event.target as HTMLInputElement).checked;
    const updatedTask: Task = {
      ...this.task,
      isCompleted
    };
    
    this.loading = true;
    this.taskService.updateTask(updatedTask)
      .subscribe({
        next: () => {
          this.task.isCompleted = isCompleted;
          this.taskStatusChanged.emit(this.task);
          this.loading = false;
        },
        error: error => {
          console.error('Error updating task status', error);
          this.loading = false;
        }
      });
  }
  
  formatDate(date: Date | undefined): string {
    if (!date) return 'No due date';
    return new Date(date).toLocaleDateString();
  }
}
