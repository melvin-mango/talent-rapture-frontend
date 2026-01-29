// app/api/auth/[...nextauth]/authOptions.ts
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { handleStrapiError } from "@/lib/utils";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

export const authOptions: NextAuthOptions = {
  providers: [
    // Strapi Credentials Provider
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          const response = await fetch(`${STRAPI_URL}/api/auth/local`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              identifier: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = handleStrapiError(errorData.error || errorData);
            throw new Error(errorMessage);
          }

          const data = await response.json();

          // Fetch full user profile to get all fields including firstName, lastName
          const meResponse = await fetch(`${STRAPI_URL}/api/users/me`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${data.jwt}`,
            },
          });

          let fullUser = data.user;
          if (meResponse.ok) {
            fullUser = await meResponse.json();
          }

          const firstName = fullUser.firstName || "";
          const lastName = fullUser.lastName || "";

          return {
            id: fullUser.id.toString(),
            email: fullUser.email,
            name: `${firstName} ${lastName}`.trim() || fullUser.email,
            image: fullUser.profileImage || null,
            jwt: data.jwt,
            user: fullUser,
            firstName,
            lastName,
          };
        } catch (error) {
          throw new Error(
            error instanceof Error ? error.message : "Authentication failed"
          );
        }
      },
    }),

    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      async profile(profile) {
        try {
          // Create or get user in Strapi via our callback API
          const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
          const callbackResponse = await fetch(`${baseUrl}/api/auth/google/callback`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: profile.email,
              firstName: (profile as any).given_name || profile.name?.split(" ")[0] || "",
              lastName: (profile as any).family_name || profile.name?.split(" ").slice(1).join(" ") || "",
              image: profile.picture,
              googleId: profile.sub,
            }),
          });

          if (!callbackResponse.ok) {
            const errorText = await callbackResponse.text();
            console.error("Google callback failed:", errorText);
            throw new Error(`Failed to create or fetch user from Strapi: ${errorText}`);
          }

          const callbackData = await callbackResponse.json();
          const strapiUser = callbackData.data?.user || {};
          const jwtToken = callbackData.data?.jwt || null;
          
          console.log("Google callback returned:", {
            hasJwt: !!jwtToken,
            jwtToken: jwtToken ? jwtToken.substring(0, 20) + "..." : null,
            userId: strapiUser.id,
            email: strapiUser.email,
          });

          return {
            id: strapiUser.id?.toString() || profile.sub,
            email: strapiUser.email || profile.email,
            name: strapiUser.firstName
              ? `${strapiUser.firstName} ${strapiUser.lastName || ""}`.trim()
              : profile.name,
            image: profile.picture,
            provider: "google",
            googleId: profile.sub,
            jwt: jwtToken,
            user: strapiUser,
            firstName: strapiUser.firstName || "",
            lastName: strapiUser.lastName || "",
          };
        } catch (error) {
          console.error("Google profile error:", error);
          throw error;
        }
      },
    }),
  ],

  pages: {
    signIn: "/",
    error: "/",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.jwt = (user as any).jwt;
        token.user = (user as any).user;
        token.firstName = (user as any).firstName;
        token.lastName = (user as any).lastName;
      }
      return token;
    },

    async session({ session, token }) {
      (session as any).jwt = token.jwt;
      const firstName = token.firstName || (token.user as any)?.firstName || "";
      const lastName = token.lastName || (token.user as any)?.lastName || "";
      
      (session as any).user = {
        ...session.user,
        name: `${firstName} ${lastName}`.trim() || session.user?.email || "User",
        firstName,
        lastName,
        id: token.sub || (token.user as any)?.id,
        ...(token.user as any),
      };
      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
};
