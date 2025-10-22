"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Label } from "@/components/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { Alert, AlertDescription } from "@/components/ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { Progress } from "@/components/ui";
import { 
  Upload, 
  Camera, 
  FileText, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { toast } from "react-hot-toast";
import { kycSubmissionSchema } from "@/lib/validations";
import { useAuth } from "@/hooks/use-auth";

export default function KycPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    idType: "",
    idNumber: "",
    selfieUrl: "",
    docFrontUrl: "",
    docBackUrl: "",
    criminalRecordUrl: "",
    addressProofUrl: "",
  });
  
  const router = useRouter();
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { user } = useAuth();

  const steps = [
    { number: 1, title: "Tipo de Identificación", description: "Selecciona tu tipo de documento" },
    { number: 2, title: "Documento de Identidad", description: "Sube fotos de tu documento" },
    { number: 3, title: "Selfie", description: "Toma una selfie para verificación" },
    { number: 4, title: "Récord Policial", description: "Sube tu récord policial" },
    { number: 5, title: "Comprobante de Dirección", description: "Sube comprobante de dirección" },
    { number: 6, title: "Revisión", description: "Revisa y envía tu información" },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleFileUpload = async (file: File, field: string) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${field}-${Date.now()}.${fileExt}`;
      const filePath = `kyc-documents/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('kyc-documents')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('kyc-documents')
        .getPublicUrl(filePath);

      handleInputChange(field, data.publicUrl);
      toast.success("Archivo subido exitosamente");
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error("Error al subir el archivo");
    }
  };

  const validateStep = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return formData.idType && formData.idNumber;
      case 2:
        return formData.docFrontUrl;
      case 3:
        return formData.selfieUrl;
      case 4:
        return formData.criminalRecordUrl;
      case 5:
        return formData.addressProofUrl;
      case 6:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    } else {
      setError("Por favor completa todos los campos requeridos");
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError("");

      // Validar datos
      const validatedData = kycSubmissionSchema.parse(formData);

      // Crear submission
      const { error } = await supabase
        .from('kyc_submissions')
        .insert({
          userId: user?.id,
          ...validatedData,
          status: 'PENDING_REVIEW',
        });

      if (error) {
        throw error;
      }

      toast.success("Verificación KYC enviada exitosamente");
      router.push('/pro');
    } catch (error) {
      console.error('Error submitting KYC:', error);
      setError("Error al enviar la verificación. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || user.role !== 'PRO') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Acceso Denegado</h2>
            <p className="text-gray-600 mb-4">
              Solo los profesionales pueden acceder a la verificación KYC.
            </p>
            <Button onClick={() => router.push('/')}>
              Volver al Inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button variant="ghost" onClick={() => router.push('/pro')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <div className="ml-4">
                <h1 className="text-xl font-bold text-gray-900">Verificación KYC</h1>
                <p className="text-sm text-gray-600">Completa tu verificación para comenzar a recibir clientes</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((stepItem, index) => (
              <div key={stepItem.number} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  step >= stepItem.number 
                    ? 'bg-manito-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step > stepItem.number ? <CheckCircle className="w-4 h-4" /> : stepItem.number}
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
          <Progress value={(step / steps.length) * 100} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-6 h-6 mr-2 text-manito-500" />
              {steps[step - 1].title}
            </CardTitle>
            <CardDescription>
              {steps[step - 1].description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Step 1: ID Type */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="idType">Tipo de Identificación</Label>
                  <Select value={formData.idType} onValueChange={(value) => handleInputChange("idType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu tipo de documento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cedula">Cédula de Identidad</SelectItem>
                      <SelectItem value="pasaporte">Pasaporte</SelectItem>
                      <SelectItem value="licencia">Licencia de Conducir</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="idNumber">Número de Identificación</Label>
                  <Input
                    id="idNumber"
                    placeholder="Ingresa tu número de identificación"
                    value={formData.idNumber}
                    onChange={(e) => handleInputChange("idNumber", e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Document Photos */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Frente del Documento</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-gray-600 mb-4">
                        Sube una foto clara del frente de tu documento
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, 'docFrontUrl');
                        }}
                        className="hidden"
                        id="docFront"
                      />
                      <Button asChild>
                        <label htmlFor="docFront">
                          <Upload className="w-4 h-4 mr-2" />
                          Subir Foto
                        </label>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Reverso del Documento (Opcional)</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-gray-600 mb-4">
                        Sube una foto del reverso si aplica
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, 'docBackUrl');
                        }}
                        className="hidden"
                        id="docBack"
                      />
                      <Button variant="outline" asChild>
                        <label htmlFor="docBack">
                          <Upload className="w-4 h-4 mr-2" />
                          Subir Foto
                        </label>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Selfie */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Selfie para Verificación</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-gray-600 mb-4">
                        Toma una selfie clara para verificar tu identidad
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        capture="user"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, 'selfieUrl');
                        }}
                        className="hidden"
                        id="selfie"
                      />
                      <Button asChild>
                        <label htmlFor="selfie">
                          <Camera className="w-4 h-4 mr-2" />
                          Tomar Selfie
                        </label>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Criminal Record */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Récord Policial</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-gray-600 mb-4">
                        Sube tu récord policial o certificado de antecedentes
                      </p>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, 'criminalRecordUrl');
                        }}
                        className="hidden"
                        id="criminalRecord"
                      />
                      <Button asChild>
                        <label htmlFor="criminalRecord">
                          <Upload className="w-4 h-4 mr-2" />
                          Subir Documento
                        </label>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Address Proof */}
            {step === 5 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Comprobante de Dirección</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-gray-600 mb-4">
                        Sube un comprobante de dirección (recibo de servicios, contrato, etc.)
                      </p>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, 'addressProofUrl');
                        }}
                        className="hidden"
                        id="addressProof"
                      />
                      <Button asChild>
                        <label htmlFor="addressProof">
                          <Upload className="w-4 h-4 mr-2" />
                          Subir Documento
                        </label>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Review */}
            {step === 6 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Revisa tu información</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Tipo de Identificación</Label>
                      <p className="text-sm text-gray-600">{formData.idType}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Número de Identificación</Label>
                      <p className="text-sm text-gray-600">{formData.idNumber}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Documentos Subidos</Label>
                    <div className="space-y-2">
                      {formData.docFrontUrl && (
                        <div className="flex items-center text-sm text-green-600">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Documento frontal
                        </div>
                      )}
                      {formData.docBackUrl && (
                        <div className="flex items-center text-sm text-green-600">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Documento trasero
                        </div>
                      )}
                      {formData.selfieUrl && (
                        <div className="flex items-center text-sm text-green-600">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Selfie
                        </div>
                      )}
                      {formData.criminalRecordUrl && (
                        <div className="flex items-center text-sm text-green-600">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Récord policial
                        </div>
                      )}
                      {formData.addressProofUrl && (
                        <div className="flex items-center text-sm text-green-600">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Comprobante de dirección
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {step > 1 ? (
                <Button variant="outline" onClick={handlePrevious}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Anterior
                </Button>
              ) : (
                <div />
              )}

              {step < 6 ? (
                <Button onClick={handleNext} variant="manito">
                  Siguiente
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} variant="manito" disabled={isLoading}>
                  {isLoading ? "Enviando..." : "Enviar Verificación"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
