"use client";

import { useAuth } from './use-auth';

export function useRole() {
  const { user, loading } = useAuth();

  const isAdmin = user?.role === 'ADMIN';
  const isPro = user?.role === 'PRO';
  const isClient = user?.role === 'CLIENT';
  const isVerified = user?.kycStatus === 'APPROVED';

  return {
    user,
    loading,
    isAdmin,
    isPro,
    isClient,
    isVerified,
    role: user?.role,
    kycStatus: user?.kycStatus,
  };
}
