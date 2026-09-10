// lib/types.ts - Authentication and Event types

export interface Users {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  confirmed: boolean;
  sessions: Object;
  updatedAt: string;
  createdAt: string;
  collection: string
}

export interface AuthResponse {
  jwt: string;
  user: Users;
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
  title: string;
  date: string;
  time: string;
  location: string;
  image: MediaFile | null;
  flyer: MediaFile | null;
  createdAt: string;
  updatedAt: string;
}

export interface EventsResponse {
  docs: Event[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  nextPage: number | null;
  page: number;
  pagingCounter: number;
  prevPage: number | null;
  totalDocs: number;
  totalPages: number;
}

// Event Registration types
export interface EventRegistration {
  id: number;
  documentId: string;
  phone: string;
  physicalAddress: string;
  numberOfParticipants: number;
  event?: Event;
  users_permissions_user?: Users;
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
