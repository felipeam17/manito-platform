"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { Badge } from "@/components/ui";
import { Button } from "@/components/ui";
import { Alert, AlertDescription } from "@/components/ui";
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  FileText,
  Camera,
  Upload
} from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAuth } from "@/hooks/use-auth";
import { KycSubmissionWithUser } from "@/types";

export function KycStatus() {
  const [kycSubmission, setKycSubmission] = useState<KycSubmissionWithUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (user?.id) {
      loadKycSubmission();
    }
  }, [user?.id]);

  const loadKycSubmission = async () => {
    try {
      const { data, error } = await supabase
        .from('kyc_submissions')
        .select(`
          *,
          user:users(id, name, email, phone, role)
        `)
        .eq('userId', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      setKycSubmission(data);
    } catch (error) {
      console.error('Error loading KYC submission:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return {
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
          badge: <Badge variant="success">Verificado</Badge>,
          title: "Verificación Aprobada",
          description: "Tu verificación KYC ha sido aprobada. Ya puedes recibir clientes.",
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200"
        };
      case 'REJECTED':
        return {
          icon: <XCircle className="w-5 h-5 text-red-500" />,
          badge: <Badge variant="destructive">Rechazado</Badge>,
          title: "Verificación Rechazada",
          description: "Tu verificación KYC fue rechazada. Contacta soporte para más información.",
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200"
        };
      case 'PENDING_REVIEW':
        return {
          icon: <Clock className="w-5 h-5 text-yellow-500" />,
          badge: <Badge variant="warning">Pendiente</Badge>,
          title: "Verificación en Revisión",
          description: "Tu verificación está siendo revisada. Te notificaremos cuando esté lista.",
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200"
        };
      default:
        return {
          icon: <AlertTriangle className="w-5 h-5 text-gray-500" />,
          badge: <Badge variant="secondary">No Verificado</Badge>,
          title: "Verificación Requerida",
          description: "Completa tu verificación KYC para comenzar a recibir clientes.",
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200"
        };
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const statusInfo = getStatusInfo(kycSubmission?.status || 'PENDING_REVIEW');

  return (
    <Card className={`${statusInfo.bgColor} ${statusInfo.borderColor} border-2`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="w-6 h-6 text-manito-500 mr-3" />
            <div>
              <CardTitle className="text-lg">Verificación KYC</CardTitle>
              <CardDescription>
                Estado de tu verificación de identidad
              </CardDescription>
            </div>
          </div>
          {statusInfo.icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Estado:</span>
            {statusInfo.badge}
          </div>

          <Alert className={statusInfo.bgColor}>
            <AlertDescription className={statusInfo.color}>
              <strong>{statusInfo.title}</strong>
              <br />
              {statusInfo.description}
            </AlertDescription>
          </Alert>

          {kycSubmission && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tipo de ID:</span>
                <span className="text-sm text-gray-600">{kycSubmission.idType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Número:</span>
                <span className="text-sm text-gray-600">{kycSubmission.idNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Enviado:</span>
                <span className="text-sm text-gray-600">
                  {new Date(kycSubmission.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              {kycSubmission.reviewNotes && (
                <div className="space-y-2">
                  <span className="text-sm font-medium">Notas de Revisión:</span>
                  <p className="text-sm text-gray-600 bg-white p-2 rounded border">
                    {kycSubmission.reviewNotes}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex space-x-2">
            {(!kycSubmission || kycSubmission.status === 'REJECTED') && (
              <Button asChild>
                <a href="/kyc">
                  <Upload className="w-4 h-4 mr-2" />
                  {kycSubmission ? 'Reenviar Verificación' : 'Iniciar Verificación'}
                </a>
              </Button>
            )}
            
            {kycSubmission && (
              <Button variant="outline" asChild>
                <a href="/kyc">
                  <FileText className="w-4 h-4 mr-2" />
                  Ver Detalles
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
