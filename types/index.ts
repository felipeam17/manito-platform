import { User, Role, KycStatus, BookingStatus, PricingType } from '@manito/db';

export type { User, Role, KycStatus, BookingStatus, PricingType };

export interface AuthUser extends User {
  id: string;
  role: Role;
  kycStatus: KycStatus;
}

export interface ServiceWithDetails {
  id: string;
  title: string;
  description: string;
  pricingType: PricingType;
  price: number;
  durationMin: number;
  category: {
    id: string;
    name: string;
    icon?: string;
  };
  pro: {
    id: string;
    name: string;
    avatarUrl?: string;
    ratingAvg: number;
    ratingCount: number;
    proProfile?: {
      bio?: string;
      serviceRadiusKm: number;
      coverageCities: string[];
    };
  };
  images: string[];
}

export interface BookingWithDetails {
  id: string;
  startAt: Date;
  endAt: Date;
  status: BookingStatus;
  notes?: string;
  priceCents: number;
  service: ServiceWithDetails;
  client: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  pro: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  address: {
    id: string;
    line1: string;
    line2?: string;
    city: string;
    lat?: number;
    lng?: number;
  };
  review?: {
    id: string;
    rating: number;
    comment?: string;
    images: string[];
  };
}

export interface KycSubmissionWithUser {
  id: string;
  idType: string;
  idNumber: string;
  selfieUrl: string;
  docFrontUrl: string;
  docBackUrl?: string;
  criminalRecordUrl: string;
  addressProofUrl?: string;
  status: KycStatus;
  reviewedBy?: string;
  reviewNotes?: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: Role;
  };
}

export interface SearchFilters {
  category?: string;
  city?: string;
  date?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  verified?: boolean;
}

export interface WhatsAppMessage {
  from: string;
  body: string;
  timestamp: string;
  type: 'text' | 'image' | 'document';
}

export interface WhatsAppSession {
  phone: string;
  state: 'idle' | 'searching' | 'selecting' | 'booking' | 'payment';
  data?: {
    service?: string;
    location?: string;
    date?: string;
    selectedPro?: string;
    bookingId?: string;
  };
}
