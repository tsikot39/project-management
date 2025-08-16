import { ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
  className?: string;
}

export function AppLayout({ children, className = '' }: AppLayoutProps) {
  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-background via-background-secondary to-background ${className}`}
    >
      {/* Background pattern for subtle texture */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-mesh opacity-5" />
        <div className="absolute inset-0 grid-pattern" />
      </div>

      {/* Main content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

interface PageHeaderProps {
  readonly title: string;
  readonly description?: string;
  readonly action?: ReactNode;
  readonly className?: string;
}

export function PageHeader({
  title,
  description,
  action,
  className = '',
}: PageHeaderProps) {
  return (
    <div className={`flex items-center justify-between mb-8 ${className}`}>
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-on-surface tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-lg text-on-surface-variant max-w-2xl text-pretty">
            {description}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  className?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  color = 'primary',
  className = '',
}: StatsCardProps) {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600 border-primary-100',
    secondary: 'bg-secondary-50 text-secondary-600 border-secondary-100',
    success: 'bg-success-50 text-success-600 border-success-100',
    warning: 'bg-warning-50 text-warning-600 border-warning-100',
    error: 'bg-error-50 text-error-600 border-error-100',
  };

  return (
    <div className={`card-modern hover-lift ${className}`}>
      <div className="flex items-center space-x-4">
        <div
          className={`flex-shrink-0 w-16 h-16 rounded-2xl border flex items-center justify-center ${colorClasses[color]}`}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-on-surface-variant mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-on-surface">{value}</p>
          {description && (
            <p className="text-sm text-on-surface-muted mt-1">{description}</p>
          )}
          {trend && (
            <p
              className={`text-sm mt-2 ${trend.isPositive ? 'text-success-600' : 'text-error-600'}`}
            >
              <span className="inline-flex items-center">
                {trend.isPositive ? '↗' : '↘'} {trend.value}
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`text-center py-16 ${className}`}>
      <div className="w-24 h-24 bg-surface-variant rounded-2xl flex items-center justify-center mx-auto mb-6">
        <div className="text-on-surface-muted">{icon}</div>
      </div>
      <h3 className="text-xl font-semibold text-on-surface mb-2">{title}</h3>
      <p className="text-on-surface-variant mb-6 max-w-md mx-auto text-pretty">
        {description}
      </p>
      {action && action}
    </div>
  );
}

interface SectionProps {
  readonly title?: string;
  readonly description?: string;
  readonly action?: ReactNode;
  readonly children: ReactNode;
  readonly className?: string;
}

export function Section({
  title,
  description,
  action,
  children,
  className = '',
}: SectionProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {title && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-on-surface">{title}</h2>
            {description && (
              <p className="text-on-surface-variant mt-1">{description}</p>
            )}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
