"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@manito/ui";
import { Input } from "@manito/ui";
import { Label } from "@manito/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@manito/ui";
import { Alert, AlertDescription } from "@manito/ui";
import { RadioGroup, RadioGroupItem } from "@manito/ui";
import { Checkbox } from "@manito/ui";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft, Check } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "react-hot-toast";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    role: "CLIENT" as "CLIENT" | "PRO",
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError("");
  };

  const validateStep1 = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError("Todos los campos son obligatorios");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return false;
    }
    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.name || !formData.phone) {
      setError("Todos los campos son obligatorios");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.acceptTerms) {
      setError("Debes aceptar los términos y condiciones");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (authData.user) {
        // Crear perfil de usuario en la base de datos
        const { error: profileError } = await supabase
          .from("users")
          .insert({
            id: authData.user.id,
            email: formData.email,
            name: formData.name,
            phone: formData.phone,
            role: formData.role,
            kycStatus: formData.role === "PRO" ? "PENDING_REVIEW" : "APPROVED",
          });

        if (profileError) {
          setError("Error al crear el perfil. Inténtalo de nuevo.");
          return;
        }

        // Si es profesional, crear perfil profesional
        if (formData.role === "PRO") {
          const { error: proError } = await supabase
            .from("pro_profiles")
            .insert({
              userId: authData.user.id,
              bio: "",
              serviceRadiusKm: 20,
              coverageCities: [],
              availability: {},
            });

          if (proError) {
            console.error("Error creating pro profile:", proError);
          }
        }

        toast.success("¡Cuenta creada exitosamente!");
        router.push("/auth/verify");
      }
    } catch (error) {
      setError("Error inesperado. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Información básica", description: "Email y contraseña" },
    { number: 2, title: "Datos personales", description: "Nombre y teléfono" },
    { number: 3, title: "Tipo de cuenta", description: "Cliente o Profesional" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-manito-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center">
            <div className="w-12 h-12 bg-manito-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="ml-3 text-2xl font-bold text-gray-900">MANITO</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Crear Cuenta</CardTitle>
            <CardDescription>
              Únete a la plataforma de servicios profesionales más confiable
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {steps.map((stepItem, index) => (
                  <div key={stepItem.number} className="flex items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                      step >= stepItem.number 
                        ? 'bg-manito-500 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {step > stepItem.number ? <Check className="w-4 h-4" /> : stepItem.number}
                    </div>
                    <div className="ml-3 hidden sm:block">
                      <p className="text-sm font-medium text-gray-900">{stepItem.title}</p>
                      <p className="text-xs text-gray-500">{stepItem.description}</p>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`hidden sm:block w-16 h-0.5 mx-4 ${
                        step > stepItem.number ? 'bg-manito-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Step 1: Basic Info */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Mínimo 6 caracteres"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Repite tu contraseña"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Personal Info */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre Completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Tu nombre completo"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+507 1234-5678"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Account Type */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-base font-medium">Tipo de Cuenta</Label>
                    <RadioGroup
                      value={formData.role}
                      onValueChange={(value) => handleInputChange("role", value)}
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="CLIENT" id="client" />
                        <Label htmlFor="client" className="flex-1 cursor-pointer">
                          <div className="font-medium">Cliente</div>
                          <div className="text-sm text-gray-500">
                            Busco servicios profesionales para mi hogar o negocio
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="PRO" id="pro" />
                        <Label htmlFor="pro" className="flex-1 cursor-pointer">
                          <div className="font-medium">Profesional</div>
                          <div className="text-sm text-gray-500">
                            Ofrezco servicios profesionales (requiere verificación KYC)
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="terms"
                        checked={formData.acceptTerms}
                        onCheckedChange={(checked) => handleInputChange("acceptTerms", checked as boolean)}
                        required
                      />
                      <Label htmlFor="terms" className="text-sm leading-relaxed">
                        Acepto los{" "}
                        <Link href="/terms" className="text-manito-500 hover:text-manito-600 underline">
                          Términos y Condiciones
                        </Link>{" "}
                        y la{" "}
                        <Link href="/privacy" className="text-manito-500 hover:text-manito-600 underline">
                          Política de Privacidad
                        </Link>
                      </Label>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                {step > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                  >
                    Anterior
                  </Button>
                ) : (
                  <div />
                )}

                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    variant="manito"
                  >
                    Siguiente
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="manito"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
                  </Button>
                )}
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes cuenta?{" "}
                <Link href="/auth/login" className="text-manito-500 hover:text-manito-600 font-medium">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link
                href="/"
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al inicio
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
