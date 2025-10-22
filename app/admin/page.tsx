"use client";

import { AuthGuard } from "@/components/auth/auth-guard";
import { KycStats } from "@/components/admin/kyc-stats";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@manito/ui";
import { Badge } from "@manito/ui";
import { Button } from "@manito/ui";
import { 
  Users, 
  Shield, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp
} from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <AuthGuard requiredRole="ADMIN">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-manito-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">MANITO</span>
                <Badge variant="destructive" className="ml-3">Admin</Badge>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Panel de Administración
            </h1>
            <p className="text-gray-600 mt-2">
              Gestiona la plataforma y supervisa la actividad
            </p>
          </div>

          {/* KYC Stats */}
          <div className="mb-8">
            <KycStats />
          </div>

          {/* Management Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Usuarios</CardTitle>
                <CardDescription>
                  Administra usuarios y verificaciones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-yellow-600 mr-3" />
                    <div>
                      <p className="font-medium text-yellow-800">Verificaciones KYC Pendientes</p>
                      <p className="text-sm text-yellow-600">23 profesionales esperando aprobación</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Revisar
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                    <div>
                      <p className="font-medium text-green-800">Usuarios Activos</p>
                      <p className="text-sm text-green-600">1,211 usuarios verificados</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Ver Lista
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reportes y Analytics</CardTitle>
                <CardDescription>
                  Métricas de la plataforma
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <TrendingUp className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium text-blue-800">Crecimiento Mensual</p>
                      <p className="text-sm text-blue-600">+15% nuevos usuarios</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Ver Reporte
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-purple-600 mr-3" />
                    <div>
                      <p className="font-medium text-purple-800">Ingresos del Mes</p>
                      <p className="text-sm text-purple-600">$12,345 en comisiones</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Ver Finanzas
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
