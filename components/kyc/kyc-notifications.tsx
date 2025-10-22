"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { Badge } from "@/components/ui";
import { Button } from "@/components/ui";
import { Alert, AlertDescription } from "@/components/ui";
import { 
  Bell, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Shield
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { useAuth } from "@/hooks/use-auth";
import { KycSubmissionWithUser } from "@/types";

export function KycNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

  useEffect(() => {
    if (user?.id) {
      loadNotifications();
    }
  }, [user?.id]);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);

      // Obtener notificaciones de KYC para el usuario
      const { data, error } = await supabase
        .from('kyc_submissions')
        .select(`
          *,
          user:users(id, name, email, phone, role)
        `)
        .eq('userId', user?.id)
        .order('createdAt', { ascending: false })
        .limit(5);

      if (error) {
        throw error;
      }

      setNotifications(data || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getNotificationIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'REJECTED':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'PENDING_REVIEW':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationMessage = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'Tu verificación KYC ha sido aprobada. ¡Ya puedes recibir clientes!';
      case 'REJECTED':
        return 'Tu verificación KYC fue rechazada. Contacta soporte para más información.';
      case 'PENDING_REVIEW':
        return 'Tu verificación KYC está siendo revisada. Te notificaremos cuando esté lista.';
      default:
        return 'Estado de verificación desconocido.';
    }
  };

  const getNotificationColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'REJECTED':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'PENDING_REVIEW':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
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

  if (notifications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2 text-manito-500" />
            Notificaciones KYC
          </CardTitle>
          <CardDescription>
            Aquí aparecerán las actualizaciones de tu verificación
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No hay notificaciones de KYC</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="w-5 h-5 mr-2 text-manito-500" />
          Notificaciones KYC
        </CardTitle>
        <CardDescription>
          Actualizaciones de tu verificación de identidad
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Alert key={notification.id} className={getNotificationColor(notification.status)}>
              <div className="flex items-start">
                {getNotificationIcon(notification.status)}
                <div className="ml-3 flex-1">
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {getNotificationMessage(notification.status)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(notification.updatedAt || notification.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {notification.reviewNotes && (
                      <p className="text-sm mt-2 text-gray-600">
                        <strong>Notas:</strong> {notification.reviewNotes}
                      </p>
                    )}
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
