"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui';
import { Badge } from '@/components/ui';
import { User, Settings, LogOut, Shield, Star } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'react-hot-toast';

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
      toast.success('Sesión cerrada exitosamente');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  const getKycStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <Badge variant="success" className="text-xs">Verificado</Badge>;
      case 'PENDING_REVIEW':
        return <Badge variant="warning" className="text-xs">Pendiente</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive" className="text-xs">Rechazado</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">No verificado</Badge>;
    }
  };

  if (!user) {
    return (
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <a href="/auth/login">Iniciar Sesión</a>
        </Button>
        <Button size="sm" variant="manito" asChild>
          <a href="/auth/register">Registrarse</a>
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatarUrl} alt={user.name || ''} />
            <AvatarFallback>
              {user.name?.split(' ').map(n => n[0]).join('') || 'U'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                {user.role === 'PRO' ? 'Profesional' : user.role === 'ADMIN' ? 'Admin' : 'Cliente'}
              </Badge>
              {getKycStatusBadge(user.kycStatus)}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/dashboard')}>
          <User className="mr-2 h-4 w-4" />
          <span>Dashboard</span>
        </DropdownMenuItem>
        
        {user.role === 'PRO' && (
          <DropdownMenuItem onClick={() => router.push('/pro')}>
            <Shield className="mr-2 h-4 w-4" />
            <span>Panel Profesional</span>
          </DropdownMenuItem>
        )}
        
        {user.role === 'ADMIN' && (
          <DropdownMenuItem onClick={() => router.push('/admin')}>
            <Shield className="mr-2 h-4 w-4" />
            <span>Panel Admin</span>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem onClick={() => router.push('/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Configuración</span>
        </DropdownMenuItem>
        
        {user.role === 'PRO' && user.ratingCount > 0 && (
          <DropdownMenuItem onClick={() => router.push('/reviews')}>
            <Star className="mr-2 h-4 w-4" />
            <span>Reseñas ({user.ratingCount})</span>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
