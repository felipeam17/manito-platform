import Link from "next/link";
import { Card, CardContent } from "@/components/ui";

const categories = [
  {
    id: "plomeria",
    name: "Plomería",
    icon: "🔧",
    description: "Reparaciones, instalaciones y mantenimiento",
    color: "bg-blue-50 border-blue-200 text-blue-700",
    href: "/services/plomeria",
  },
  {
    id: "electricidad",
    name: "Electricidad",
    icon: "⚡",
    description: "Instalaciones eléctricas y reparaciones",
    color: "bg-yellow-50 border-yellow-200 text-yellow-700",
    href: "/services/electricidad",
  },
  {
    id: "pintura",
    name: "Pintura",
    icon: "🎨",
    description: "Pintura interior y exterior",
    color: "bg-purple-50 border-purple-200 text-purple-700",
    href: "/services/pintura",
  },
  {
    id: "jardineria",
    name: "Jardinería",
    icon: "🌱",
    description: "Mantenimiento y diseño de jardines",
    color: "bg-green-50 border-green-200 text-green-700",
    href: "/services/jardineria",
  },
  {
    id: "limpieza",
    name: "Limpieza",
    icon: "🧹",
    description: "Servicios de limpieza doméstica y comercial",
    color: "bg-pink-50 border-pink-200 text-pink-700",
    href: "/services/limpieza",
  },
  {
    id: "carpinteria",
    name: "Carpintería",
    icon: "🔨",
    description: "Muebles y trabajos en madera",
    color: "bg-orange-50 border-orange-200 text-orange-700",
    href: "/services/carpinteria",
  },
];

export function Categories() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Servicios Populares
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Encuentra el profesional perfecto para cualquier oficio que necesites
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={category.href}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center text-2xl mr-4 group-hover:scale-110 transition-transform duration-300`}>
                      {category.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-manito-500 transition-colors">
                      {category.name}
                    </h3>
                  </div>
                  <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
                    {category.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/services">
            <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-manito-500 hover:bg-manito-600 transition-colors">
              Ver Todos los Servicios
              <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
