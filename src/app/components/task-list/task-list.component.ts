// task-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { TaskItemComponent } from '../task-item/task-item.component';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, TaskItemComponent]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  loading = false;
  error = '';
  
  constructor(private taskService: TaskService) { }
  
  ngOnInit(): void {
    this.loadTasks();
  }
  
  loadTasks() {
    this.loading = true;
    this.taskService.getTasks()
      .subscribe({
        next: tasks => {
          this.tasks = tasks;
          this.loading = false;
        },
        error: error => {
          this.error = 'Error loading tasks';
          this.loading = false;
        }
      });
  }
  
  onTaskDeleted(id: number) {
    this.tasks = this.tasks.filter(task => task.id !== id);
  }
  
  onTaskStatusChanged(task: Task) {
    const index = this.tasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      this.tasks[index] = task;
    }
  }
}
