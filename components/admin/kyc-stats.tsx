"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { Badge } from "@/components/ui";
import { Button } from "@/components/ui";
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp,
  Users,
  AlertTriangle
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

interface KycStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  pendingReview: number;
}

export function KycStats() {
  const [stats, setStats] = useState<KycStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    pendingReview: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoading(true);

      // Obtener estadísticas de KYC
      const { data: kycData, error: kycError } = await supabase
        .from('kyc_submissions')
        .select('status');

      if (kycError) {
        throw kycError;
      }

      // Obtener estadísticas de usuarios
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('kycStatus, role')
        .eq('role', 'PRO');

      if (userError) {
        throw userError;
      }

      // Calcular estadísticas
      const kycStats = {
        total: kycData?.length || 0,
        pending: kycData?.filter(s => s.status === 'PENDING_REVIEW').length || 0,
        approved: kycData?.filter(s => s.status === 'APPROVED').length || 0,
        rejected: kycData?.filter(s => s.status === 'REJECTED').length || 0,
        pendingReview: userData?.filter(u => u.kycStatus === 'PENDING_REVIEW').length || 0,
      };

      setStats(kycStats);
    } catch (error) {
      console.error('Error loading KYC stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Verificaciones</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Aprobadas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rechazadas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
