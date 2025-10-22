import { notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";

const prisma = new PrismaClient();

export default async function ProDetailPage({ params }: { params: { id: string } }) {
  const pro = await prisma.user.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      avatarUrl: true,
      ratingAvg: true,
      ratingCount: true,
      proProfile: { select: { bio: true, serviceRadiusKm: true, coverageCities: true } },
      services: { select: { id: true, title: true, description: true, priceCents: true, category: { select: { id: true, name: true } } } },
      reviewsAsPro: { select: { id: true, rating: true, comment: true, createdAt: true, client: { select: { name: true } } }, take: 10, orderBy: { createdAt: "desc" } },
    },
  });

  if (!pro) return notFound();

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{pro.name}</h1>
        <span>⭐ {pro.ratingAvg.toFixed(1)} ({pro.ratingCount})</span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Servicios ofrecidos</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {pro.services.map(s => (
            <div key={s.id} className="border rounded-md p-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{s.title}</h3>
                <Badge>{s.category.name}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-3">{s.description}</p>
              <p className="mt-2 font-semibold">${(s.priceCents / 100).toFixed(2)}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reseñas recientes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {pro.reviewsAsPro.length === 0 && <p className="text-sm text-muted-foreground">Aún no hay reseñas.</p>}
          {pro.reviewsAsPro.map(r => (
            <div key={r.id} className="border rounded-md p-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">{r.client?.name ?? "Cliente"}</span>
                <span>⭐ {r.rating}</span>
              </div>
              {r.comment && <p className="text-sm mt-1">{r.comment}</p>}
              <p className="text-xs text-muted-foreground mt-1">{new Date(r.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
