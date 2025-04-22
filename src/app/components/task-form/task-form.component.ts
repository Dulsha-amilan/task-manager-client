// task-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  isEditMode = false;
  taskId?: number;
  
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private taskService: TaskService
  ) {
    this.taskForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: [''],
      dueDate: [null]
    });
  }
  
  ngOnInit(): void {
    this.taskId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.taskId;
    
    if (this.isEditMode) {
      this.loading = true;
      this.taskService.getTask(this.taskId!)
        .subscribe({
          next: task => {
            this.taskForm.patchValue({
              title: task.title,
              description: task.description,
              dueDate: task.dueDate ? new Date(task.dueDate) : null
            });
            this.loading = false;
          },
          error: error => {
            this.error = 'Error loading task';
            this.loading = false;
          }
        });
    }
  }
  
  // convenience getter for easy access to form fields
  get f() { return this.taskForm.controls; }
  
  onSubmit() {
    this.submitted = true;
    
    // stop here if form is invalid
    if (this.taskForm.invalid) {
      return;
    }
    
    this.loading = true;
    
    const task: Task = {
      id: this.isEditMode ? this.taskId : undefined,
      title: this.f['title'].value,
      description: this.f['description'].value,
      isCompleted: false,
      createdAt: new Date(),
      dueDate: this.f['dueDate'].value
    };
    
    if (this.isEditMode) {
      this.taskService.updateTask(task)
        .subscribe({
          next: () => {
            this.router.navigate(['/tasks']);
          },
          error: error => {
            this.error = 'Error updating task';
            this.loading = false;
          }
        });
    } else {
      this.taskService.createTask(task)
        .subscribe({
          next: () => {
            this.router.navigate(['/tasks']);
          },
          error: error => {
            this.error = 'Error creating task';
            this.loading = false;
          }
        });
    }
  }
}
