import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  className?: string;
  variant?:
    | 'primary'
    | 'secondary'
    | 'ghost'
    | 'success'
    | 'warning'
    | 'error'
    | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonProps) {
  const baseClasses =
    'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center';

  const variants = {
    primary:
      'bg-primary-500 hover:bg-primary-600 text-white shadow-soft hover:shadow-medium focus:ring-primary-500/20',
    secondary:
      'bg-surface hover:bg-surface-variant text-on-surface border border-border hover:border-border-variant shadow-soft hover:shadow-medium',
    ghost:
      'bg-transparent hover:bg-surface-variant text-on-surface-variant hover:text-on-surface',
    success:
      'bg-success-500 hover:bg-success-600 text-white shadow-soft hover:shadow-medium focus:ring-success-500/20',
    warning:
      'bg-warning-500 hover:bg-warning-600 text-white shadow-soft hover:shadow-medium focus:ring-warning-500/20',
    error:
      'bg-error-500 hover:bg-error-600 text-white shadow-soft hover:shadow-medium focus:ring-error-500/20',
    outline:
      'bg-transparent hover:bg-surface-variant text-on-surface border border-border hover:border-border-variant shadow-soft hover:shadow-medium',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

interface InputProps {
  className?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: any) => void;
  label?: string;
  error?: string;
}

export function Input({ className = '', label, error, ...props }: InputProps) {
  const inputId = label ? label.toLowerCase().replace(/\s+/g, '-') : undefined;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-on-surface mb-2"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-4 py-3 bg-surface border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 placeholder:text-on-surface-variant/60 ${
          error
            ? 'border-error-500 focus:ring-error-500/20 focus:border-error-500'
            : 'border-border'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-error-600">{error}</p>}
    </div>
  );
}

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  children,
  className = '',
  hover = false,
  padding = 'md',
}: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`bg-surface rounded-xl shadow-card border border-border/50 ${
        hover
          ? 'hover:shadow-card-hover hover:scale-[1.02] cursor-pointer transform-gpu transition-all duration-200'
          : ''
      } ${paddingClasses[padding]} ${className}`}
    >
      {children}
    </div>
  );
}

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'secondary';
  size?: 'sm' | 'md';
}

export function Badge({
  children,
  variant = 'primary',
  size = 'md',
}: BadgeProps) {
  const variants = {
    primary: 'bg-primary-50 text-primary-700 border-primary-200',
    success: 'bg-success-50 text-success-700 border-success-200',
    warning: 'bg-warning-50 text-warning-700 border-warning-200',
    error: 'bg-error-50 text-error-700 border-error-200',
    secondary: 'bg-secondary-50 text-secondary-700 border-secondary-200',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </span>
  );
}

interface StatusBadgeProps {
  status: 'todo' | 'in_progress' | 'review' | 'done';
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const statusConfig = {
    todo: { label: 'To Do', variant: 'secondary' as const },
    in_progress: { label: 'In Progress', variant: 'primary' as const },
    review: { label: 'Review', variant: 'warning' as const },
    done: { label: 'Done', variant: 'success' as const },
  };

  const config = statusConfig[status];
  return (
    <Badge variant={config.variant} size={size}>
      {config.label}
    </Badge>
  );
}

interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high';
  size?: 'sm' | 'md';
}

export function PriorityBadge({ priority, size = 'md' }: PriorityBadgeProps) {
  const priorityConfig = {
    low: { label: 'Low', variant: 'success' as const },
    medium: { label: 'Medium', variant: 'warning' as const },
    high: { label: 'High', variant: 'error' as const },
  };

  const config = priorityConfig[priority];
  return (
    <Badge variant={config.variant} size={size}>
      {config.label}
    </Badge>
  );
}
