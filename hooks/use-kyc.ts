"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from './use-auth';
import { KycSubmissionWithUser } from '@/types';

export function useKyc() {
  const [kycSubmission, setKycSubmission] = useState<KycSubmissionWithUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const supabase = createClient();

  useEffect(() => {
    if (user?.id) {
      loadKycSubmission();
    }
  }, [user?.id]);

  const loadKycSubmission = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('kyc_submissions')
        .select(`
          *,
          user:users(id, name, email, phone, role)
        `)
        .eq('userId', user?.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw fetchError;
      }

      setKycSubmission(data);
    } catch (err) {
      console.error('Error loading KYC submission:', err);
      setError('Error al cargar la verificación KYC');
    } finally {
      setIsLoading(false);
    }
  };

  const submitKyc = async (formData: any) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: submitError } = await supabase
        .from('kyc_submissions')
        .insert({
          userId: user?.id,
          ...formData,
          status: 'PENDING_REVIEW',
        })
        .select()
        .single();

      if (submitError) {
        throw submitError;
      }

      setKycSubmission(data);
      return data;
    } catch (err) {
      console.error('Error submitting KYC:', err);
      setError('Error al enviar la verificación KYC');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadFile = async (file: File, field: string) => {
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

      return data.publicUrl;
    } catch (err) {
      console.error('Error uploading file:', err);
      throw new Error('Error al subir el archivo');
    }
  };

  const getKycStatus = () => {
    if (!kycSubmission) return 'NOT_SUBMITTED';
    return kycSubmission.status;
  };

  const isKycApproved = () => {
    return getKycStatus() === 'APPROVED';
  };

  const isKycPending = () => {
    return getKycStatus() === 'PENDING_REVIEW';
  };

  const isKycRejected = () => {
    return getKycStatus() === 'REJECTED';
  };

  const canSubmitKyc = () => {
    const status = getKycStatus();
    return status === 'NOT_SUBMITTED' || status === 'REJECTED';
  };

  return {
    kycSubmission,
    isLoading,
    error,
    loadKycSubmission,
    submitKyc,
    uploadFile,
    getKycStatus,
    isKycApproved,
    isKycPending,
    isKycRejected,
    canSubmitKyc,
  };
}
