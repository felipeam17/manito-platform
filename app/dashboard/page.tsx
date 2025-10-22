"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { Badge } from "@/components/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { 
  Calendar, 
  DollarSign, 
  Star, 
  Settings, 
  LogOut, 
  Plus,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { createClient } from "@supabase/ssr";
import { toast } from "react-hot-toast";

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
  kycStatus: string;
  ratingAvg: number;
  ratingCount: number;
}

interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  totalEarnings: number;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalEarnings: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (!authUser) {
          router.push('/auth/login');
          return;
        }

        // Obtener datos del usuario
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (userData) {
          setUser(userData);
          
          // Obtener estadísticas
          const { data: bookings } = await supabase
            .from('bookings')
            .select('status, priceCents')
            .or(`clientId.eq.${authUser.id},proId.eq.${authUser.id}`);

          if (bookings) {
            const totalBookings = bookings.length;
            const pendingBookings = bookings.filter(b => b.status === 'PENDING' || b.status === 'CONFIRMED').length;
            const completedBookings = bookings.filter(b => b.status === 'COMPLETED').length;
            const totalEarnings = bookings
              .filter(b => b.status === 'COMPLETED')
              .reduce((sum, b) => sum + b.priceCents, 0);

            setStats({
              totalBookings,
              pendingBookings,
              completedBookings,
              totalEarnings,
            });
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        toast.error('Error al cargar los datos');
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, [supabase, router]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
      toast.success('Sesión cerrada exitosamente');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  const getKycStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <Badge variant="success">Verificado</Badge>;
      case 'PENDING_REVIEW':
        return <Badge variant="warning">Pendiente</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive">Rechazado</Badge>;
      default:
        return <Badge variant="secondary">No verificado</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-manito-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
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
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={user.avatarUrl} />
                  <AvatarFallback>
                    {user.name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            ¡Bienvenido, {user.name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-600 mt-2">
            Aquí tienes un resumen de tu actividad en MANITO
          </p>
        </div>

        {/* KYC Status Alert */}
        {user.role === 'PRO' && user.kycStatus !== 'APPROVED' && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-orange-500 mr-3" />
                <div>
                  <p className="font-medium text-orange-800">
                    Verificación KYC {user.kycStatus === 'PENDING_REVIEW' ? 'Pendiente' : 'Rechazada'}
                  </p>
                  <p className="text-sm text-orange-600">
                    {user.kycStatus === 'PENDING_REVIEW' 
                      ? 'Tu verificación está siendo revisada. Te notificaremos cuando esté lista.'
                      : 'Tu verificación fue rechazada. Por favor, contacta soporte para más información.'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Reservas</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingBookings}</p>
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
                  <p className="text-sm font-medium text-gray-600">Completadas</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completedBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-manito-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-manito-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ganancias</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${(stats.totalEarnings / 100).toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>
                Gestiona tu cuenta y servicios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.role === 'PRO' && (
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Servicio
                </Button>
              )}
              
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Ver Reservas
              </Button>
              
              <Button className="w-full justify-start" variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Configuración
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estado de Cuenta</CardTitle>
              <CardDescription>
                Información de tu perfil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Verificación KYC</span>
                {getKycStatusBadge(user.kycStatus)}
              </div>
              
              {user.role === 'PRO' && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Calificación</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-sm font-medium">
                      {user.ratingAvg.toFixed(1)} ({user.ratingCount} reseñas)
                    </span>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tipo de Cuenta</span>
                <Badge variant="secondary">
                  {user.role === 'PRO' ? 'Profesional' : 'Cliente'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
