export interface Task {
  id?: number;
  title: string;
  description: string;
  isCompleted: boolean;
  dueDate: Date | string; // Allow both Date and string to handle API responses
  createdAt?: Date | string;
  userId: number;
}
