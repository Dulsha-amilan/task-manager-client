// task-item.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Output() delete = new EventEmitter<number>();
  today = new Date(); // Added this for the date comparison in template
  
  constructor(private router: Router) { }
  
  onEdit(): void {
    if (this.task.id) {
      this.router.navigate(['/tasks/edit', this.task.id]);
    }
  }
  
  onDelete(): void {
    if (this.task.id) {
      this.delete.emit(this.task.id);
    }
  }
  
  getStatusClass(): string {
    if (this.task.isCompleted) {
      return 'status-completed';
    }
    
    const dueDate = new Date(this.task.dueDate);
    const today = new Date();
    
    if (dueDate < today && !this.task.isCompleted) {
      return 'status-overdue';
    }
    
    return 'status-pending';
  }
}