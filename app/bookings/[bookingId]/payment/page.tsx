"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, Button, Alert, AlertDescription } from "@/components/ui";
import { CreditCard, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface BookingInfo {
  id: string;
  service: {
    title: string;
    priceCents: number;
  };
  pro: {
    name: string | null;
  };
  startAt: string;
  endAt: string;
  status: string;
}

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<BookingInfo | null>(null);

  const paymentIntentId = searchParams.get("payment_intent");

  useEffect(() => {
    const loadBooking = async () => {
      try {
        const response = await fetch(`/api/bookings/${params.bookingId}`);
        if (response.ok) {
          setBooking(await response.json());
        }
      } catch (error) {
        console.error("Error loading booking:", error);
      }
    };

    loadBooking();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/bookings/${params.bookingId}/success`,
        },
      });

      if (error) {
        toast.error(error.message || "Error en el pago");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Error al procesar el pago");
    } finally {
      setLoading(false);
    }
  };

  if (!booking) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Información de Pago
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentElement />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resumen de la Reserva</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span>Servicio:</span>
            <span>{booking.service.title}</span>
          </div>
          <div className="flex justify-between">
            <span>Profesional:</span>
            <span>{booking.pro.name}</span>
          </div>
          <div className="flex justify-between">
            <span>Fecha:</span>
            <span>{new Date(booking.startAt).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Hora:</span>
            <span>
              {new Date(booking.startAt).toLocaleTimeString()} - {new Date(booking.endAt).toLocaleTimeString()}
            </span>
          </div>
          <div className="border-t pt-3">
            <div className="flex justify-between font-semibold">
              <span>Total:</span>
              <span>${(booking.service.priceCents * 1.05 / 100).toFixed(2)}</span>
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
          Volver
        </Button>
        <Button
          type="submit"
          disabled={!stripe || !elements || loading}
          className="flex-1"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Procesando...
            </>
          ) : (
            "Confirmar Pago"
          )}
        </Button>
      </div>
    </form>
  );
}

export default function PaymentPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClientSecret = async () => {
      try {
        const response = await fetch(`/api/bookings/${params.bookingId}/payment-intent`);
        if (response.ok) {
          const { clientSecret } = await response.json();
          setClientSecret(clientSecret);
        }
      } catch (error) {
        console.error("Error loading client secret:", error);
        toast.error("Error al cargar la información de pago");
      } finally {
        setLoading(false);
      }
    };

    loadClientSecret();
  }, [params.bookingId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <Alert>
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              No se pudo cargar la información de pago. Por favor, intenta de nuevo.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Confirmar Pago</h1>
          <p className="text-muted-foreground">Completa tu pago para confirmar la reserva</p>
        </div>

        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: "stripe",
            },
          }}
        >
          <PaymentForm />
        </Elements>
      </div>
    </div>
  );
}
