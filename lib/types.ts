// lib/types.ts - Authentication and Event types

export interface User {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  confirmed: boolean;
  blocked: boolean;
}

export interface AuthResponse {
  jwt: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Media type for uploaded files/images
export interface MediaFile {
  id: number;
  name: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: Record<string, any>;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  provider: string;
  provider_metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Event type matching the Strapi schema
export interface Event {
  id: number;
  documentId: string;
  title: string;
  time: string;
  location: string;
  date: string;
  image?: MediaFile;
  flyer?: MediaFile;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventsResponse {
  data: Event[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Event Registration types
export interface EventRegistration {
  id: number;
  documentId: string;
  phone: string;
  physicalAddress: string;
  numberOfParticipants: number;
  event?: Event;
  users_permissions_user?: User;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventRegistrationRequest {
  phone: string;
  physicalAddress: string;
  numberOfParticipants: number;
  event: number;
}

export interface EventRegistrationsResponse {
  data: EventRegistration[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
