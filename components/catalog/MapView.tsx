"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

interface MapViewProps {
  center: { lat: number; lng: number };
  services: Array<{
    id: string;
    title: string;
    pro: { name: string | null };
    priceCents: number;
  }>;
  onServiceClick?: (serviceId: string) => void;
}

export default function MapView({ center, services, onServiceClick }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center,
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    });

    setMap(mapInstance);
  }, [center]);

  useEffect(() => {
    if (!map || !services.length) return;

    // Limpiar marcadores anteriores
    markers.forEach(marker => marker.setMap(null));

    const newMarkers = services.map(service => {
      const marker = new google.maps.Marker({
        position: center, // Por ahora usamos el centro, después se puede usar coordenadas reales
        map,
        title: service.title,
        label: `$${(service.priceCents / 100).toFixed(0)}`,
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-semibold">${service.title}</h3>
            <p class="text-sm text-gray-600">${service.pro.name}</p>
            <p class="text-sm font-medium">$${(service.priceCents / 100).toFixed(2)}</p>
          </div>
        `,
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
        if (onServiceClick) {
          onServiceClick(service.id);
        }
      });

      return marker;
    });

    setMarkers(newMarkers);

    return () => {
      newMarkers.forEach(marker => marker.setMap(null));
    };
  }, [map, services, onServiceClick]);

  return (
    <Card className="h-96">
      <CardHeader>
        <CardTitle>Mapa de servicios</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div ref={mapRef} className="w-full h-80 rounded-b-lg" />
      </CardContent>
    </Card>
  );
}
