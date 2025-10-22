"use client";

import React, { useEffect, useState } from "react";
import Filters, { type Filters as FiltersType } from "@/components/catalog/Filters";
import MapView from "@/components/catalog/MapView";
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui";
import { Map, List } from "lucide-react";

type Category = { id: string; name: string };

type ServiceItem = {
  id: string;
  title: string;
  description: string;
  priceCents: number;
  ratingAvg: number;
  ratingCount: number;
  category: { id: string; name: string };
  pro: { id: string; name: string | null; avatarUrl: string | null };
};

export default function ServicesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [currentFilters, setCurrentFilters] = useState<FiltersType>({});

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/services/categories");
      if (res.ok) setCategories(await res.json());
      applyFilters({});
    };
    load();
  }, []);

  const applyFilters = async (filters: FiltersType) => {
    setLoading(true);
    setCurrentFilters(filters);
    const query = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") query.append(k, String(v));
    });
    const res = await fetch(`/api/services/search?${query.toString()}`);
    const data = res.ok ? await res.json() : [];
    setServices(data);
    setLoading(false);
  };

  const mapCenter = currentFilters.lat && currentFilters.lng 
    ? { lat: currentFilters.lat, lng: currentFilters.lng }
    : { lat: 8.9833, lng: -79.5167 }; // Panamá por defecto

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Servicios</h1>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4 mr-2" />
            Lista
          </Button>
          <Button
            variant={viewMode === "map" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("map")}
          >
            <Map className="h-4 w-4 mr-2" />
            Mapa
          </Button>
        </div>
      </div>

      <Filters categories={categories} onApply={applyFilters} />

      {loading ? (
        <p>Cargando...</p>
      ) : viewMode === "map" ? (
        <MapView
          center={mapCenter}
          services={services}
          onServiceClick={(serviceId) => {
            const service = services.find(s => s.id === serviceId);
            if (service) {
              window.location.href = `/pro/${service.pro.id}`;
            }
          }}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Card key={s.id} className="hover:shadow-md transition">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{s.title}</span>
                  <Badge>{s.category.name}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-3">{s.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">${(s.priceCents / 100).toFixed(2)}</span>
                  <span className="text-sm">⭐ {s.ratingAvg.toFixed(1)} ({s.ratingCount})</span>
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => (window.location.href = `/pro/${s.pro.id}`)}>Ver profesional</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
