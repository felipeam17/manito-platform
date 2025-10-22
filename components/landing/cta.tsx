import Link from "next/link";
import { Button } from "@/components/ui";
import { ArrowRight, Smartphone, MessageCircle } from "lucide-react";

export function CTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-manito-500 to-manito-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Listo para comenzar?
          </h2>
          <p className="text-xl text-manito-100 mb-8 max-w-2xl mx-auto">
            Únete a la plataforma de servicios profesionales más confiable de Panamá
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/auth/register">
                Buscar Servicios
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-manito-500" asChild>
              <Link href="/pro">
                Soy Profesional
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>

          {/* WhatsApp CTA */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mr-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">También por WhatsApp</h3>
                <p className="text-manito-100">Chatea con nuestro bot</p>
              </div>
            </div>
            <p className="text-manito-100 mb-6">
              Simplemente escribe "Hola" a nuestro número de WhatsApp y te ayudaremos a encontrar el servicio que necesitas.
            </p>
            <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white" asChild>
              <Link href="https://wa.me/50712345678" target="_blank">
                <Smartphone className="mr-2 w-5 h-5" />
                Chatear por WhatsApp
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
