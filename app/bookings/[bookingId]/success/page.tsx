"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, Button, Alert, AlertDescription } from "@/components/ui";
import { CheckCircle, Calendar, MapPin, User, CreditCard } from "lucide-react";
import { toast } from "react-hot-toast";

interface BookingDetails {
  id: string;
  service: {
    title: string;
    priceCents: number;
  };
  pro: {
    name: string | null;
    avatarUrl: string | null;
  };
  startAt: string;
  endAt: string;
  status: string;
  notes?: string;
}

export default function BookingSuccessPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBooking = async () => {
      try {
        const response = await fetch(`/api/bookings/${params.bookingId}`);
        if (response.ok) {
          const bookingData = await response.json();
          setBooking(bookingData);
        } else {
          toast.error("No se pudo cargar la información de la reserva");
        }
      } catch (error) {
        console.error("Error loading booking:", error);
        toast.error("Error al cargar la información");
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [params.bookingId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <Alert>
            <AlertDescription>
              No se pudo cargar la información de la reserva.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Confirmación de éxito */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-green-600">
              ¡Reserva Confirmada!
            </h1>
            <p className="text-muted-foreground">
              Tu pago se ha procesado exitosamente y tu reserva está confirmada.
            </p>
          </div>
        </div>

        {/* Detalles de la reserva */}
        <Card>
          <CardHeader>
            <CardTitle>Detalles de tu Reserva</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{booking.service.title}</p>
                <p className="text-sm text-muted-foreground">
                  Profesional: {booking.pro.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">
                  {new Date(booking.startAt).toLocaleDateString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(booking.startAt).toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })} - {new Date(booking.endAt).toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">
                  Total Pagado: ${(booking.service.priceCents * 1.05 / 100).toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Incluye comisión de servicio
                </p>
              </div>
            </div>

            {booking.notes && (
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-1">Notas:</p>
                <p className="text-sm">{booking.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Información adicional */}
        <Card>
          <CardHeader>
            <CardTitle>¿Qué sigue?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-blue-600">1</span>
              </div>
              <div>
                <p className="font-medium">Recibirás una confirmación por email</p>
                <p className="text-sm text-muted-foreground">
                  Te enviaremos todos los detalles de tu reserva.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-blue-600">2</span>
              </div>
              <div>
                <p className="font-medium">El profesional se pondrá en contacto</p>
                <p className="text-sm text-muted-foreground">
                  Te contactará para confirmar los detalles finales.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-blue-600">3</span>
              </div>
              <div>
                <p className="font-medium">Disfruta de tu servicio</p>
                <p className="text-sm text-muted-foreground">
                  El profesional llegará en la fecha y hora acordada.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Acciones */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard")}
            className="flex-1"
          >
            Ir al Dashboard
          </Button>
          <Button
            onClick={() => router.push("/services")}
            className="flex-1"
          >
            Buscar Más Servicios
          </Button>
        </div>
      </div>
    </div>
  );
}
