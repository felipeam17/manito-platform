import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, BookingStatus } from "@prisma/client";
import Stripe from "stripe";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(request: NextRequest) {
  try {
    const {
      serviceId,
      proId,
      startAt,
      endAt,
      address,
      notes,
      priceCents,
    } = await request.json();

    // Validar datos requeridos
    if (!serviceId || !proId || !startAt || !endAt || !address || !priceCents) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    // Obtener información del servicio
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: { pro: true },
    });

    if (!service) {
      return NextResponse.json(
        { error: "Servicio no encontrado" },
        { status: 404 }
      );
    }

    // Calcular comisión MANITO (5%)
    const manitoCommission = Math.round(priceCents * 0.05);
    const proAmount = priceCents - manitoCommission;

    // Crear la reserva en la base de datos
    const booking = await prisma.booking.create({
      data: {
        clientId: "temp-client-id", // TODO: Obtener del usuario autenticado
        proId,
        serviceId,
        startAt: new Date(startAt),
        endAt: new Date(endAt),
        status: BookingStatus.PENDING,
        notes,
        priceCents,
        // TODO: Agregar addressId cuando se implemente la gestión de direcciones
      },
    });

    // Crear Payment Intent en Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(priceCents * 1.05), // Incluir comisión en el total
      currency: "usd",
      metadata: {
        bookingId: booking.id,
        serviceId,
        proId,
        manitoCommission: manitoCommission.toString(),
        proAmount: proAmount.toString(),
      },
      description: `Reserva: ${service.title}`,
    });

    return NextResponse.json({
      bookingId: booking.id,
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
