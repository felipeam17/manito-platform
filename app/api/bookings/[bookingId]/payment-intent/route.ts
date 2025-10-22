import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function GET(
  request: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: params.bookingId },
      include: { service: true },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Reserva no encontrada" },
        { status: 404 }
      );
    }

    // Crear Payment Intent si no existe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(booking.priceCents * 1.05), // Incluir comisión
      currency: "usd",
      metadata: {
        bookingId: booking.id,
        serviceId: booking.serviceId,
        proId: booking.proId,
      },
      description: `Reserva: ${booking.service.title}`,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
