"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@manito/ui';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'ADMIN' | 'PRO' | 'CLIENT';
  requireVerification?: boolean;
  redirectTo?: string;
}

export function AuthGuard({ 
  children, 
  requiredRole, 
  requireVerification = false,
  redirectTo = '/auth/login' 
}: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(redirectTo);
        return;
      }

      if (requiredRole && user.role !== requiredRole) {
        // Redirigir según el rol del usuario
        if (user.role === 'ADMIN') {
          router.push('/admin');
        } else if (user.role === 'PRO') {
          router.push('/pro');
        } else {
          router.push('/dashboard');
        }
        return;
      }

      if (requireVerification && user.kycStatus !== 'APPROVED') {
        router.push('/auth/verify');
        return;
      }
    }
  }, [user, loading, requiredRole, requireVerification, redirectTo, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requiredRole && user.role !== requiredRole) {
    return null;
  }

  if (requireVerification && user.kycStatus !== 'APPROVED') {
    return null;
  }

  return <>{children}</>;
}
