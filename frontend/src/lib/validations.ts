import { z } from 'zod';

// User validation schemas
export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain uppercase, lowercase, number, and special character'
    ),
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name cannot exceed 100 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Project validation schemas
export const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, 'Project name is required')
    .max(100, 'Project name cannot exceed 100 characters'),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

// Task validation schemas
export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Task title is required')
    .max(100, 'Task title cannot exceed 100 characters'),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
  priority: z.enum(['low', 'medium', 'high']),
  dueDate: z.date().optional(),
  assigneeId: z.string().uuid().optional(),
  tags: z.array(z.string()).optional(),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Task title is required')
    .max(100, 'Task title cannot exceed 100 characters')
    .optional(),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  status: z.enum(['todo', 'in_progress', 'review', 'done']).optional(),
  dueDate: z.date().optional(),
  assigneeId: z.string().uuid().optional(),
  tags: z.array(z.string()).optional(),
  position: z.number().optional(),
});

// Comment validation schemas
export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment cannot exceed 1000 characters'),
  taskId: z.string().uuid(),
});

// Filter validation schemas
export const taskFiltersSchema = z.object({
  status: z.array(z.enum(['todo', 'in_progress', 'review', 'done'])).optional(),
  priority: z.array(z.enum(['low', 'medium', 'high'])).optional(),
  assigneeId: z.array(z.string().uuid()).optional(),
  tags: z.array(z.string()).optional(),
  dueDate: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .optional(),
  search: z.string().optional(),
});

export const projectFiltersSchema = z.object({
  status: z.array(z.enum(['active', 'archived', 'completed'])).optional(),
  search: z.string().optional(),
});

// Form validation helpers
export type CreateUserForm = z.infer<typeof createUserSchema>;
export type LoginForm = z.infer<typeof loginSchema>;
export type CreateProjectForm = z.infer<typeof createProjectSchema>;
export type UpdateProjectForm = z.infer<typeof updateProjectSchema>;
export type CreateTaskForm = z.infer<typeof createTaskSchema>;
export type UpdateTaskForm = z.infer<typeof updateTaskSchema>;
export type CreateCommentForm = z.infer<typeof createCommentSchema>;
export type TaskFiltersForm = z.infer<typeof taskFiltersSchema>;
export type ProjectFiltersForm = z.infer<typeof projectFiltersSchema>;
