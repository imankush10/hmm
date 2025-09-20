"use client";

import { useSession } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user,
    isAuthenticated: !!session,
    isLoading: status === "loading",
    isAdmin: session?.user?.role === "admin",
    isUser: session?.user?.role === "user",
  };
}

export function useRequireAuth(requiredRole = null) {
  const auth = useAuth();

  const hasPermission = () => {
    if (!auth.isAuthenticated) return false;
    if (!requiredRole) return true;
    if (requiredRole === "admin") return auth.isAdmin;
    return true;
  };

  return {
    ...auth,
    hasPermission: hasPermission(),
  };
}
