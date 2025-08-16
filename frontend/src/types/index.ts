// User types
export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'admin' | 'manager' | 'member' | 'viewer';

export interface CreateUserData {
  email: string;
  password: string;
  fullName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Project types
export interface Project {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  members: string[];
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type ProjectStatus = 'active' | 'archived' | 'completed';

export interface CreateProjectData {
  name: string;
  description?: string;
}

// Task types
export interface Task {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  assigneeId?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  tags: string[];
  position: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  subtasks: Subtask[];
}

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate?: Date;
  assigneeId?: string;
  tags?: string[];
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  status?: TaskStatus;
  position?: number;
}

// Comment types
export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCommentData {
  content: string;
  taskId: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Filter types
export interface TaskFilters {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  assigneeId?: string[];
  tags?: string[];
  dueDate?: {
    from?: Date;
    to?: Date;
  };
  search?: string;
}

export interface ProjectFilters {
  status?: ProjectStatus[];
  search?: string;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  relatedId?: string;
}

export type NotificationType =
  | 'task_assigned'
  | 'task_completed'
  | 'task_due_soon'
  | 'comment_added'
  | 'project_updated'
  | 'mention';

// Real-time event types
export interface RealTimeEvent {
  type: string;
  data: any;
  timestamp: Date;
}

export interface TaskUpdatedEvent extends RealTimeEvent {
  type: 'task_updated';
  data: {
    taskId: string;
    projectId: string;
    updates: Partial<Task>;
    updatedBy: string;
  };
}

export interface UserPresenceEvent extends RealTimeEvent {
  type: 'user_presence';
  data: {
    userId: string;
    status: 'online' | 'offline' | 'away';
    lastSeen?: Date;
  };
}
