"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { Alert, AlertDescription } from "@/components/ui";
import { Mail, CheckCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { toast } from "react-hot-toast";

export default function VerifyPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

  useEffect(() => {
    // Obtener el email del usuario actual
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || "");
      }
    };
    getUser();
  }, [supabase.auth]);

  const handleResendEmail = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        toast.error("Error al reenviar el email");
        return;
      }

      toast.success("Email de verificación reenviado");
    } catch (error) {
      toast.error("Error inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user?.email_confirmed_at) {
        toast.success("¡Email verificado exitosamente!");
        
        // Redirigir según el rol
        const { data: profile } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profile?.role === "ADMIN") {
          router.push("/admin");
        } else if (profile?.role === "PRO") {
          router.push("/pro");
        } else {
          router.push("/dashboard");
        }
      } else {
        toast.error("El email aún no ha sido verificado");
      }
    } catch (error) {
      toast.error("Error al verificar el estado");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-manito-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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
            <div className="w-16 h-16 bg-manito-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-manito-500" />
            </div>
            <CardTitle className="text-2xl font-bold">Verifica tu Email</CardTitle>
            <CardDescription>
              Hemos enviado un enlace de verificación a tu correo electrónico
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Revisa tu bandeja de entrada y haz clic en el enlace de verificación para activar tu cuenta.
              </AlertDescription>
            </Alert>

            {email && (
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Email enviado a: <span className="font-medium">{email}</span>
                </p>
              </div>
            )}

            <div className="space-y-4">
              <Button
                onClick={handleCheckVerification}
                variant="manito"
                className="w-full"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Ya verifiqué mi email
              </Button>

              <Button
                onClick={handleResendEmail}
                variant="outline"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Reenviando...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Reenviar email
                  </>
                )}
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                ¿No recibiste el email? Revisa tu carpeta de spam o{" "}
                <button
                  onClick={handleResendEmail}
                  className="text-manito-500 hover:text-manito-600 font-medium"
                  disabled={isLoading}
                >
                  reenvíalo
                </button>
              </p>
            </div>

            <div className="text-center">
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
