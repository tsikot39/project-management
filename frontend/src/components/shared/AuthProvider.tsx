import { ReactNode } from 'react';

interface Props {
  readonly children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  return <>{children}</>;
}

export function ProtectedRoute({ children }: Props) {
  // For now, just render children - add auth logic later
  return <>{children}</>;
}
