import type { ReactNode } from 'react';
import { Navigate } from 'react-router';

import { useAuth } from '@/context/AuthContext';

import {
  hasAllowedRole,
  type AppRole,
} from '@/config/roleAccess';

interface RoleProtectedRouteProps {
  allowedRoles: AppRole[];
  children?: ReactNode;
}

export function RoleProtectedRoute({
  allowedRoles,
  children,
}: RoleProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const userRoles = user.roles ?? [];

  if (!hasAllowedRole(userRoles, allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}