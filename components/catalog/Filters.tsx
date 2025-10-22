import React, { useState } from "react";
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Button } from "@/components/ui";
import { useGeolocation } from "@/hooks/use-geolocation";
import { MapPin, Loader2 } from "lucide-react";

export type Filters = {
  q?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  date?: string; // ISO date for availability
  lat?: number;
  lng?: number;
  distanceKm?: number;
};

interface Props {
  categories: { id: string; name: string }[];
  defaultValues?: Filters;
  onApply: (filters: Filters) => void;
}

export default function Filters({ categories, defaultValues, onApply }: Props) {
  const [q, setQ] = useState(defaultValues?.q ?? "");
  const [categoryId, setCategoryId] = useState<string | undefined>(defaultValues?.categoryId);
  const [minPrice, setMinPrice] = useState<string>(defaultValues?.minPrice?.toString() ?? "");
  const [maxPrice, setMaxPrice] = useState<string>(defaultValues?.maxPrice?.toString() ?? "");
  const [minRating, setMinRating] = useState<string>(defaultValues?.minRating?.toString() ?? "");
  const [date, setDate] = useState<string>(defaultValues?.date ?? "");
  const [distanceKm, setDistanceKm] = useState<string>(defaultValues?.distanceKm?.toString() ?? "20");
  
  const { latitude, longitude, error: geoError, loading: geoLoading, getCurrentPosition } = useGeolocation();

  const apply = () => {
    onApply({
      q: q || undefined,
      categoryId: categoryId || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minRating: minRating ? Number(minRating) : undefined,
      date: date || undefined,
      lat: latitude || undefined,
      lng: longitude || undefined,
      distanceKm: distanceKm ? Number(distanceKm) : undefined,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-6">
        <Input placeholder="Buscar servicios o pros" value={q} onChange={(e) => setQ(e.target.value)} className="md:col-span-2" />

        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger>
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input type="number" placeholder="Precio mín ($)" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
        <Input type="number" placeholder="Precio máx ($)" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        <Input type="number" placeholder="Rating mín (1-5)" value={minRating} onChange={(e) => setMinRating(e.target.value)} />
        <Input type="date" placeholder="Fecha" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      {/* Geolocalización */}
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={getCurrentPosition}
            disabled={geoLoading}
          >
            {geoLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
            {latitude && longitude ? "Ubicación detectada" : "Usar mi ubicación"}
          </Button>
          
          {latitude && longitude && (
            <Input
              type="number"
              placeholder="Radio (km)"
              value={distanceKm}
              onChange={(e) => setDistanceKm(e.target.value)}
              className="w-24"
            />
          )}
        </div>
        
        {geoError && (
          <span className="text-sm text-red-600">{geoError}</span>
        )}
        
        {latitude && longitude && (
          <span className="text-sm text-green-600">
            📍 {latitude.toFixed(4)}, {longitude.toFixed(4)}
          </span>
        )}
      </div>

      <div className="flex justify-end">
        <Button variant="manito" onClick={apply}>Aplicar filtros</Button>
      </div>
    </div>
  );
}
