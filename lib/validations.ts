import { z } from "zod";

// Auth validations
export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const registerSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirmPassword: z.string(),
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  phone: z.string().min(8, "El teléfono debe tener al menos 8 caracteres"),
  role: z.enum(["CLIENT", "PRO"]),
  acceptTerms: z.boolean().refine(val => val === true, "Debes aceptar los términos y condiciones"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

// KYC validations
export const kycSubmissionSchema = z.object({
  idType: z.string().min(1, "Tipo de identificación requerido"),
  idNumber: z.string().min(5, "Número de identificación inválido"),
  selfieUrl: z.string().url("URL de selfie inválida"),
  docFrontUrl: z.string().url("URL de documento frontal inválida"),
  docBackUrl: z.string().url("URL de documento trasero inválida").optional(),
  criminalRecordUrl: z.string().url("URL de récord policial inválida"),
  addressProofUrl: z.string().url("URL de comprobante de dirección inválida").optional(),
});

// Service validations
export const serviceSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  pricingType: z.enum(["FIXED", "HOURLY"]),
  price: z.number().min(1, "El precio debe ser mayor a 0"),
  durationMin: z.number().min(15, "La duración mínima es 15 minutos"),
  categoryId: z.string().min(1, "Categoría requerida"),
});

// Booking validations
export const bookingSchema = z.object({
  serviceId: z.string().min(1, "Servicio requerido"),
  addressId: z.string().min(1, "Dirección requerida"),
  startAt: z.date().min(new Date(), "La fecha debe ser futura"),
  endAt: z.date(),
  notes: z.string().optional(),
}).refine(data => data.endAt > data.startAt, {
  message: "La fecha de fin debe ser posterior a la de inicio",
  path: ["endAt"],
});

// Review validations
export const reviewSchema = z.object({
  rating: z.number().min(1).max(5, "La calificación debe estar entre 1 y 5"),
  comment: z.string().min(10, "El comentario debe tener al menos 10 caracteres").optional(),
  images: z.array(z.string().url()).max(5, "Máximo 5 imágenes").optional(),
});

// Search validations
export const searchSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  city: z.string().optional(),
  date: z.string().optional(),
  priceMin: z.number().min(0).optional(),
  priceMax: z.number().min(0).optional(),
  rating: z.number().min(1).max(5).optional(),
  verified: z.boolean().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type KycSubmissionInput = z.infer<typeof kycSubmissionSchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
