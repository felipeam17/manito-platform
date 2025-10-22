import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@manito/ui";

const testimonials = [
  {
    id: 1,
    name: "Ana García",
    location: "Panama City",
    rating: 5,
    text: "Excelente servicio. El plomero llegó puntual y solucionó el problema rápidamente. Muy profesional y limpio en su trabajo.",
    service: "Plomería",
    avatar: "/avatars/ana.jpg",
  },
  {
    id: 2,
    name: "Carlos Mendoza",
    location: "San Miguelito",
    rating: 5,
    text: "MANITO me ha ayudado a encontrar clientes de calidad. La plataforma es fácil de usar y los pagos son seguros.",
    service: "Electricidad",
    avatar: "/avatars/carlos.jpg",
  },
  {
    id: 3,
    name: "María Rodríguez",
    location: "Arraiján",
    rating: 5,
    text: "El servicio de pintura fue excepcional. El profesional fue muy detallista y el resultado superó mis expectativas.",
    service: "Pintura",
    avatar: "/avatars/maria.jpg",
  },
  {
    id: 4,
    name: "Luis Torres",
    location: "David",
    rating: 5,
    text: "Como profesional, MANITO me ha permitido crecer mi negocio. Los clientes son serios y los pagos son puntuales.",
    service: "Jardinería",
    avatar: "/avatars/luis.jpg",
  },
  {
    id: 5,
    name: "Elena Vásquez",
    location: "Colón",
    rating: 5,
    text: "El servicio de limpieza fue perfecto. Muy organizados y eficientes. Definitivamente los volveré a contratar.",
    service: "Limpieza",
    avatar: "/avatars/elena.jpg",
  },
  {
    id: 6,
    name: "Roberto Silva",
    location: "Santiago",
    rating: 5,
    text: "MANITO ha revolucionado mi forma de trabajar. Ahora tengo más clientes y puedo enfocarme en hacer un buen trabajo.",
    service: "Carpintería",
    avatar: "/avatars/roberto.jpg",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Lo que dicen nuestros usuarios
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Miles de clientes y profesionales confían en MANITO para sus servicios
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Quote Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-manito-100 rounded-full flex items-center justify-center">
                  <Quote className="w-6 h-6 text-manito-500" />
                </div>
              </div>

              {/* Rating */}
              <div className="flex justify-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 text-center mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* User Info */}
              <div className="flex items-center justify-center">
                <Avatar className="w-12 h-12 mr-4">
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                  <AvatarFallback>
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.location}</p>
                  <p className="text-xs text-manito-500 font-medium">{testimonial.service}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 bg-manito-500 rounded-2xl p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">10,000+</div>
              <div className="text-manito-100">Servicios Completados</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">2,500+</div>
              <div className="text-manito-100">Profesionales Verificados</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">4.9/5</div>
              <div className="text-manito-100">Calificación Promedio</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">50+</div>
              <div className="text-manito-100">Ciudades en Panamá</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
