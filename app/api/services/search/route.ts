import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Función para calcular distancia entre dos puntos (Haversine)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || undefined;
  const categoryId = searchParams.get("categoryId") || undefined;
  const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
  const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
  const minRating = searchParams.get("minRating") ? Number(searchParams.get("minRating")) : undefined;
  const lat = searchParams.get("lat") ? Number(searchParams.get("lat")) : undefined;
  const lng = searchParams.get("lng") ? Number(searchParams.get("lng")) : undefined;
  const distanceKm = searchParams.get("distanceKm") ? Number(searchParams.get("distanceKm")) : undefined;

  const services = await prisma.service.findMany({
    where: {
      AND: [
        q
          ? {
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
              ],
            }
          : {},
        categoryId ? { categoryId } : {},
        minPrice ? { priceCents: { gte: Math.round(minPrice * 100) } } : {},
        maxPrice ? { priceCents: { lte: Math.round(maxPrice * 100) } } : {},
      ],
    },
    include: {
      category: { select: { id: true, name: true } },
      pro: { 
        select: { 
          id: true, 
          name: true, 
          avatarUrl: true, 
          ratingAvg: true, 
          ratingCount: true,
          addresses: { select: { latitude: true, longitude: true } }
        } 
      },
    },
    orderBy: [{ createdAt: "desc" }],
    take: 50, // Aumentamos para filtrar por distancia después
  });

  // Filtrar por rating
  let filteredByRating = typeof minRating === "number" ? services.filter(s => (s.pro?.ratingAvg ?? 0) >= minRating) : services;

  // Filtrar por distancia si se proporcionan coordenadas
  if (lat && lng && distanceKm) {
    filteredByRating = filteredByRating.filter(service => {
      if (!service.pro?.addresses?.length) return false;
      
      // Buscar la dirección más cercana del profesional
      const distances = service.pro.addresses.map(addr => {
        if (!addr.latitude || !addr.longitude) return Infinity;
        return calculateDistance(lat, lng, addr.latitude, addr.longitude);
      });
      
      const minDistance = Math.min(...distances);
      return minDistance <= distanceKm;
    });
  }

  const response = filteredByRating.slice(0, 30).map(s => ({
    id: s.id,
    title: s.title,
    description: s.description,
    priceCents: s.priceCents,
    ratingAvg: s.pro?.ratingAvg ?? 0,
    ratingCount: s.pro?.ratingCount ?? 0,
    category: s.category!,
    pro: { id: s.pro?.id ?? "", name: s.pro?.name ?? null, avatarUrl: s.pro?.avatarUrl ?? null },
  }));

  return NextResponse.json(response);
}
