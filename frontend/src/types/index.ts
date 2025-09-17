export interface Task {
  id: number;
  username: string;
  email: string;
  text: string;
  status: 'pending' | 'completed';
  editedByAdmin?: boolean;
  createdAt: string;
}

export interface TasksResponse {
  tasks: Task[];
  totalPages: number;
  currentPage: number;
  totalTasks: number;
}

export interface User {
  username: string;
  isAdmin: boolean;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface TasksState {
  tasks: Task[];
  totalPages: number;
  currentPage: number;
  totalTasks: number;
  sortBy: 'username' | 'email' | 'status' | null;
  sortOrder: 'asc' | 'desc';
  loading: boolean;
  error: string | null;
}

export interface CreateTaskData {
  username: string;
  email: string;
  text: string;
}

export interface UpdateTaskData {
  text?: string;
  status?: 'pending' | 'completed';
}