"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Textarea, Alert, AlertDescription } from "@/components/ui";
import { Calendar, Clock, MapPin, CreditCard, User } from "lucide-react";
import { toast } from "react-hot-toast";

interface ProInfo {
  id: string;
  name: string | null;
  avatarUrl: string | null;
  ratingAvg: number;
  ratingCount: number;
}

interface ServiceInfo {
  id: string;
  title: string;
  description: string;
  priceCents: number;
  category: { name: string };
}

interface BookingData {
  serviceId: string;
  proId: string;
  startAt: string;
  endAt: string;
  address: string;
  notes: string;
  priceCents: number;
}

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const proId = params.proId as string;
  const serviceId = params.serviceId as string;

  const [pro, setPro] = useState<ProInfo | null>(null);
  const [service, setService] = useState<ServiceInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [bookingData, setBookingData] = useState<BookingData>({
    serviceId,
    proId,
    startAt: "",
    endAt: "",
    address: "",
    notes: "",
    priceCents: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar información del profesional
        const proRes = await fetch(`/api/pro/${proId}`);
        if (proRes.ok) {
          const proData = await proRes.json();
          setPro(proData);
        }

        // Cargar información del servicio
        const serviceRes = await fetch(`/api/services/${serviceId}`);
        if (serviceRes.ok) {
          const serviceData = await serviceRes.json();
          setService(serviceData);
          setBookingData(prev => ({ ...prev, priceCents: serviceData.priceCents }));
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Error al cargar la información");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [proId, serviceId]);

  const handleInputChange = (field: keyof BookingData, value: string | number) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateTimeChange = (startAt: string) => {
    const start = new Date(startAt);
    const end = new Date(start.getTime() + 60 * 60 * 1000); // +1 hora por defecto
    
    setBookingData(prev => ({
      ...prev,
      startAt: start.toISOString(),
      endAt: end.toISOString(),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingData.startAt || !bookingData.address) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al crear la reserva");
      }

      const { bookingId, paymentIntentId } = await response.json();
      
      // Redirigir a la página de pago
      router.push(`/bookings/${bookingId}/payment?payment_intent=${paymentIntentId}`);
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(error instanceof Error ? error.message : "Error al crear la reserva");
    } finally {
      setSubmitting(false);
    }
  };

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

  if (!pro || !service) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Alert>
          <AlertDescription>
            No se pudo cargar la información del servicio o profesional.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Reservar Servicio</h1>
          <p className="text-muted-foreground">Completa los datos para confirmar tu reserva</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información del profesional */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <User className="h-5 w-5" />
                Profesional
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  {pro.avatarUrl ? (
                    <img src={pro.avatarUrl} alt={pro.name || ""} className="w-12 h-12 rounded-full" />
                  ) : (
                    <User className="h-6 w-6 text-gray-500" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{pro.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    ⭐ {pro.ratingAvg.toFixed(1)} ({pro.ratingCount} reseñas)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información del servicio */}
          <Card>
            <CardHeader>
              <CardTitle>{service.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">{service.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{service.category.name}</span>
                <span className="text-lg font-semibold">${(service.priceCents / 100).toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Datos de la reserva */}
          <Card>
            <CardHeader>
              <CardTitle>Detalles de la Reserva</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="startAt">Fecha y Hora de Inicio</Label>
                  <Input
                    id="startAt"
                    type="datetime-local"
                    value={bookingData.startAt ? new Date(bookingData.startAt).toISOString().slice(0, 16) : ""}
                    onChange={(e) => handleDateTimeChange(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endAt">Fecha y Hora de Fin</Label>
                  <Input
                    id="endAt"
                    type="datetime-local"
                    value={bookingData.endAt ? new Date(bookingData.endAt).toISOString().slice(0, 16) : ""}
                    onChange={(e) => handleInputChange("endAt", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Dirección del Servicio</Label>
                <Input
                  id="address"
                  value={bookingData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Ingresa la dirección donde se realizará el servicio"
                  required
                />
              </div>

              <div>
                <Label htmlFor="notes">Notas Adicionales (Opcional)</Label>
                <Textarea
                  id="notes"
                  value={bookingData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Describe cualquier detalle específico del servicio..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Resumen de pago */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Resumen de Pago
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Servicio</span>
                  <span>${(service.priceCents / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Comisión MANITO (5%)</span>
                  <span>${(service.priceCents * 0.05 / 100).toFixed(2)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${(service.priceCents * 1.05 / 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1"
            >
              {submitting ? "Procesando..." : "Continuar al Pago"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
