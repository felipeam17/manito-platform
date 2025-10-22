import { createClient } from '@supabase/ssr';

export const supabase = createClient();

export const storage = {
  // KYC Documents
  kyc: {
    async uploadDocument(file: File, userId: string, field: string) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${field}-${Date.now()}.${fileExt}`;
      const filePath = `kyc-documents/${fileName}`;

      const { error } = await supabase.storage
        .from('kyc-documents')
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      const { data } = supabase.storage
        .from('kyc-documents')
        .getPublicUrl(filePath);

      return data.publicUrl;
    },

    async deleteDocument(filePath: string) {
      const { error } = await supabase.storage
        .from('kyc-documents')
        .remove([filePath]);

      if (error) {
        throw error;
      }
    }
  },

  // Job Evidence
  jobEvidence: {
    async uploadEvidence(file: File, bookingId: string, field: string) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${bookingId}-${field}-${Date.now()}.${fileExt}`;
      const filePath = `job-evidence/${fileName}`;

      const { error } = await supabase.storage
        .from('job-evidence')
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      const { data } = supabase.storage
        .from('job-evidence')
        .getPublicUrl(filePath);

      return data.publicUrl;
    },

    async deleteEvidence(filePath: string) {
      const { error } = await supabase.storage
        .from('job-evidence')
        .remove([filePath]);

      if (error) {
        throw error;
      }
    }
  },

  // User Avatars
  avatars: {
    async uploadAvatar(file: File, userId: string) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-avatar-${Date.now()}.${fileExt}`;
      const filePath = `user-avatars/${fileName}`;

      const { error } = await supabase.storage
        .from('user-avatars')
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      const { data } = supabase.storage
        .from('user-avatars')
        .getPublicUrl(filePath);

      return data.publicUrl;
    },

    async deleteAvatar(filePath: string) {
      const { error } = await supabase.storage
        .from('user-avatars')
        .remove([filePath]);

      if (error) {
        throw error;
      }
    }
  }
};

export default storage;
