export interface LoginModel {
    username: string;
    password: string;
  }
  
  export interface RegisterModel {
    username: string;
    password: string;
  }
  
  export interface AuthResponse {
    success: boolean;
    message: string;
    userId: number;
    username: string;
  }
  
  export interface User {
    id: number;
    username: string;
  }