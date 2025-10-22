"use client";

import { useState, useEffect } from "react";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Button } from "@manito/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@manito/ui";
import { Badge } from "@manito/ui";
import { Alert, AlertDescription } from "@manito/ui";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@manito/ui";
import { Textarea } from "@manito/ui";
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Clock,
  User,
  FileText,
  Camera,
  AlertTriangle
} from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "react-hot-toast";
import { KycSubmissionWithUser } from "@/types";

export default function AdminKycPage() {
  const [submissions, setSubmissions] = useState<KycSubmissionWithUser[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<KycSubmissionWithUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewNotes, setReviewNotes] = useState("");
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  
  const supabase = createClientComponentClient();

  useEffect(() => {
    loadSubmissions();
  }, [filter]);

  const loadSubmissions = async () => {
    try {
      setIsLoading(true);
      
      let query = supabase
        .from('kyc_submissions')
        .select(`
          *,
          user:users(id, name, email, phone, role)
        `)
        .order('createdAt', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter.toUpperCase());
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setSubmissions(data || []);
    } catch (error) {
      console.error('Error loading submissions:', error);
      toast.error('Error al cargar las verificaciones');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReview = async (submissionId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      setIsReviewing(true);

      const { error } = await supabase
        .from('kyc_submissions')
        .update({
          status,
          reviewedBy: 'admin', // En producción, usar el ID del admin actual
          reviewNotes: reviewNotes || null,
          updatedAt: new Date().toISOString(),
        })
        .eq('id', submissionId);

      if (error) {
        throw error;
      }

      // Actualizar el estado del usuario
      const { error: userError } = await supabase
        .from('users')
        .update({
          kycStatus: status,
          updatedAt: new Date().toISOString(),
        })
        .eq('id', selectedSubmission?.userId);

      if (userError) {
        console.error('Error updating user status:', userError);
      }

      toast.success(`Verificación ${status === 'APPROVED' ? 'aprobada' : 'rechazada'} exitosamente`);
      setSelectedSubmission(null);
      setReviewNotes("");
      loadSubmissions();
    } catch (error) {
      console.error('Error reviewing submission:', error);
      toast.error('Error al procesar la verificación');
    } finally {
      setIsReviewing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <Badge variant="success">Aprobado</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive">Rechazado</Badge>;
      case 'PENDING_REVIEW':
        return <Badge variant="warning">Pendiente</Badge>;
      default:
        return <Badge variant="secondary">Desconocido</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'REJECTED':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'PENDING_REVIEW':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-manito-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando verificaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard requiredRole="ADMIN">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Shield className="w-6 h-6 text-manito-500 mr-3" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Verificaciones KYC</h1>
                  <p className="text-sm text-gray-600">Revisa y aprueba las verificaciones de profesionales</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <div className="mb-6">
            <div className="flex space-x-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
              >
                Todas
              </Button>
              <Button
                variant={filter === 'pending' ? 'default' : 'outline'}
                onClick={() => setFilter('pending')}
              >
                Pendientes
              </Button>
              <Button
                variant={filter === 'approved' ? 'default' : 'outline'}
                onClick={() => setFilter('approved')}
              >
                Aprobadas
              </Button>
              <Button
                variant={filter === 'rejected' ? 'default' : 'outline'}
                onClick={() => setFilter('rejected')}
              >
                Rechazadas
              </Button>
            </div>
          </div>

          {/* Submissions List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {submissions.map((submission) => (
              <Card key={submission.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <User className="w-5 h-5 text-gray-500 mr-2" />
                      <div>
                        <CardTitle className="text-lg">{submission.user.name}</CardTitle>
                        <CardDescription>{submission.user.email}</CardDescription>
                      </div>
                    </div>
                    {getStatusIcon(submission.status)}
                  </div>
                  <div className="flex items-center justify-between">
                    {getStatusBadge(submission.status)}
                    <span className="text-sm text-gray-500">
                      {new Date(submission.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Tipo de ID:</span>
                      <span className="text-sm text-gray-600">{submission.idType}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Número:</span>
                      <span className="text-sm text-gray-600">{submission.idNumber}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Documentos:</span>
                      <div className="flex space-x-1">
                        {submission.docFrontUrl && (
                          <FileText className="w-4 h-4 text-green-500" />
                        )}
                        {submission.selfieUrl && (
                          <Camera className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {submission.status === 'PENDING_REVIEW' && (
                    <div className="mt-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => setSelectedSubmission(submission)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Revisar
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Revisar Verificación KYC</DialogTitle>
                            <DialogDescription>
                              Revisa los documentos y decide si aprobar o rechazar la verificación.
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-6">
                            {/* User Info */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h3 className="font-semibold mb-2">Información del Usuario</h3>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <span className="text-sm font-medium">Nombre:</span>
                                  <p className="text-sm text-gray-600">{submission.user.name}</p>
                                </div>
                                <div>
                                  <span className="text-sm font-medium">Email:</span>
                                  <p className="text-sm text-gray-600">{submission.user.email}</p>
                                </div>
                                <div>
                                  <span className="text-sm font-medium">Teléfono:</span>
                                  <p className="text-sm text-gray-600">{submission.user.phone || 'N/A'}</p>
                                </div>
                                <div>
                                  <span className="text-sm font-medium">Tipo de ID:</span>
                                  <p className="text-sm text-gray-600">{submission.idType}</p>
                                </div>
                              </div>
                            </div>

                            {/* Documents */}
                            <div className="space-y-4">
                              <h3 className="font-semibold">Documentos</h3>
                              <div className="grid grid-cols-2 gap-4">
                                {submission.docFrontUrl && (
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Frente del Documento</label>
                                    <img 
                                      src={submission.docFrontUrl} 
                                      alt="Documento frontal"
                                      className="w-full h-32 object-cover rounded border"
                                    />
                                  </div>
                                )}
                                {submission.docBackUrl && (
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Reverso del Documento</label>
                                    <img 
                                      src={submission.docBackUrl} 
                                      alt="Documento trasero"
                                      className="w-full h-32 object-cover rounded border"
                                    />
                                  </div>
                                )}
                                {submission.selfieUrl && (
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Selfie</label>
                                    <img 
                                      src={submission.selfieUrl} 
                                      alt="Selfie"
                                      className="w-full h-32 object-cover rounded border"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Review Notes */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Notas de Revisión</label>
                              <Textarea
                                placeholder="Agrega notas sobre tu decisión..."
                                value={reviewNotes}
                                onChange={(e) => setReviewNotes(e.target.value)}
                                rows={3}
                              />
                            </div>
                          </div>

                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setSelectedSubmission(null);
                                setReviewNotes("");
                              }}
                            >
                              Cancelar
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleReview(submission.id, 'REJECTED')}
                              disabled={isReviewing}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Rechazar
                            </Button>
                            <Button
                              onClick={() => handleReview(submission.id, 'APPROVED')}
                              disabled={isReviewing}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Aprobar
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {submissions.length === 0 && (
            <div className="text-center py-12">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay verificaciones {filter === 'all' ? '' : filter}
              </h3>
              <p className="text-gray-600">
                {filter === 'pending' 
                  ? 'No hay verificaciones pendientes de revisión.'
                  : 'No se encontraron verificaciones con este filtro.'
                }
              </p>
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
