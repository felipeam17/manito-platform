"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { Search, MapPin, Calendar, Star, Shield, Clock } from "lucide-react";

export function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log("Search:", { searchQuery, location });
  };

  return (
    <section className="relative bg-gradient-to-br from-manito-50 to-white py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Encuentra el profesional
            <span className="text-manito-500 block">perfecto para tu oficio</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Conectamos clientes con profesionales verificados y de confianza. 
            Desde plomería hasta electricidad, encuentra el servicio que necesitas en minutos.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
            <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white rounded-xl shadow-lg border">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="¿Qué servicio necesitas?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-0 focus:ring-0 focus:outline-none text-lg"
                />
              </div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="¿Dónde?"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-0 focus:ring-0 focus:outline-none text-lg"
                />
              </div>
              <Button type="submit" size="lg" className="px-8">
                Buscar
              </Button>
            </div>
          </form>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" variant="manito" asChild>
              <Link href="/auth/register">
                Buscar Servicios
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/pro">
                Soy Profesional
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-manito-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-manito-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Profesionales Verificados
              </h3>
              <p className="text-gray-600">
                Todos nuestros profesionales pasan por un proceso de verificación KYC riguroso
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-manito-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-manito-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Respuesta Rápida
              </h3>
              <p className="text-gray-600">
                Recibe cotizaciones en minutos y agenda tu servicio el mismo día
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-manito-100 rounded-full flex items-center justify-center mb-4">
                <Star className="w-8 h-8 text-manito-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Calidad Garantizada
              </h3>
              <p className="text-gray-600">
                Sistema de calificaciones y reseñas para asegurar la mejor experiencia
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-manito-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-manito-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      </div>
    </section>
  );
}
