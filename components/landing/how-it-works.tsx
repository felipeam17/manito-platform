import { Search, Users, CreditCard, Star } from "lucide-react";

const steps = [
  {
    step: 1,
    title: "Busca tu servicio",
    description: "Describe qué necesitas y dónde estás ubicado",
    icon: Search,
    color: "bg-blue-500",
  },
  {
    step: 2,
    title: "Elige tu profesional",
    description: "Revisa perfiles, calificaciones y precios de profesionales verificados",
    icon: Users,
    color: "bg-green-500",
  },
  {
    step: 3,
    title: "Paga de forma segura",
    description: "Realiza el pago de forma segura a través de nuestra plataforma",
    icon: CreditCard,
    color: "bg-purple-500",
  },
  {
    step: 4,
    title: "Califica el servicio",
    description: "Evalúa la calidad del trabajo y ayuda a otros clientes",
    icon: Star,
    color: "bg-yellow-500",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Cómo Funciona MANITO
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Conectamos clientes con profesionales de confianza en 4 simples pasos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.step} className="relative">
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gray-300 transform translate-x-4 z-0">
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-300 rounded-full"></div>
                  </div>
                )}

                <div className="relative z-10 text-center">
                  {/* Icon */}
                  <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Step Number */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-manito-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ¿Listo para comenzar?
            </h3>
            <p className="text-gray-600 mb-6">
              Únete a miles de clientes que ya confían en MANITO para sus servicios profesionales
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-manito-500 hover:bg-manito-600 transition-colors">
                Buscar Servicios
              </button>
              <button className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                Soy Profesional
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
