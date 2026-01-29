// lib/utils.ts - Authentication utilities

import { AuthResponse, User } from "./types";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

/**
 * Store JWT and user data in localStorage
 */
export function storeAuthData(authData: AuthResponse) {
  if (typeof window !== "undefined") {
    localStorage.setItem("jwt", authData.jwt);
    localStorage.setItem("user", JSON.stringify(authData.user));
  }
}

/**
 * Get current user from localStorage
 */
export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;

  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

/**
 * Get JWT token from localStorage
 */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("jwt");
}

/**
 * Clear authentication data from localStorage
 */
export function clearAuthData() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("jwt");
}

/**
 * Create Strapi API headers with JWT
 */
export function getAuthHeaders(): Record<string, string> {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

/**
 * Handle Strapi error response
 */
export function handleStrapiError(error: any): string {
  if (error.message) {
    return error.message;
  }

  if (error.messages && Array.isArray(error.messages)) {
    return error.messages
      .map((msg: any) => msg.message || JSON.stringify(msg))
      .join(", ");
  }

  if (error.data && Array.isArray(error.data)) {
    return error.data
      .map((item: any) => item.messages?.[0]?.message || JSON.stringify(item))
      .join(", ");
  }

  return "An error occurred";
}
