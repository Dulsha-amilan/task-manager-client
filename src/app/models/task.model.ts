// models/task.model.ts
export interface Task {
  id?: number;
  title: string;
  description?: string;
  isCompleted: boolean;
  createdAt: Date;
  dueDate?: Date | null;
}
