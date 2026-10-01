// app/api/auth/[...nextauth]/authOptions.ts
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { handleStrapiError } from "@/lib/utils";

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL;
const AUTH_SECRET = process.env.NEXTAUTH_SECRET;

export const authOptions: NextAuthOptions = {
  providers: [
    // Payload credentials provider
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
          const response = await fetch(`${PAYLOAD_URL}/api/users/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = handleStrapiError(errorData.error || errorData);
            throw new Error(errorMessage);
          }

          const data = await response.json();
          const fullUser = data.user || {};
          const token = data.token || data.jwt || null;
          const firstName = fullUser.firstName || "";
          const lastName = fullUser.lastName || "";

          return {
            id: fullUser.id?.toString() || "",
            email: fullUser.email,
            name: `${firstName} ${lastName}`.trim() || fullUser.email,
            image: fullUser.profileImage || null,
            jwt: token,
            token,
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
          const googleProfile = profile as typeof profile & {
            email_verified?: boolean;
            given_name?: string;
            family_name?: string;
          };

          if (googleProfile.email_verified !== true) {
            throw new Error("Google account email is not verified");
          }

          if (!PAYLOAD_URL || !process.env.GOOGLE_AUTH_SECRET) {
            throw new Error("Google authentication is not configured");
          }

          const callbackResponse = await fetch(`${PAYLOAD_URL}/api/google-auth`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.GOOGLE_AUTH_SECRET}`,
            },
            body: JSON.stringify({
              email: profile.email,
              firstName: googleProfile.given_name || profile.name?.split(" ")[0] || "",
              lastName: googleProfile.family_name || profile.name?.split(" ").slice(1).join(" ") || "",
              image: profile.picture,
              googleId: profile.sub,
            }),
          });

          if (!callbackResponse.ok) {
            const errorText = await callbackResponse.text();
            console.error("Payload Google authentication failed:", errorText);
            throw new Error(`Google authentication failed: ${errorText}`);
          }

          const callbackData = await callbackResponse.json();
          const payloadUser = callbackData.user || {};
          const jwtToken = callbackData.token || null;
          
          console.log("Payload Google authentication returned:", {
            hasJwt: !!jwtToken,
            userId: payloadUser.id,
            email: payloadUser.email,
          });

          return {
            id: payloadUser.id?.toString() || profile.sub,
            email: payloadUser.email || profile.email,
            name: payloadUser.firstName
              ? `${payloadUser.firstName} ${payloadUser.lastName || ""}`.trim()
              : profile.name,
            image: payloadUser.profileImage || profile.picture,
            provider: "google",
            googleId: profile.sub,
            jwt: jwtToken,
            user: payloadUser,
            firstName: payloadUser.firstName || "",
            lastName: payloadUser.lastName || "",
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
        token.jwt = (user as any).jwt ?? (user as any).token;
        token.user = (user as any).user || user;
        const payloadImage = (user as typeof user & {
          user?: { profileImage?: string | null };
        }).user?.profileImage;
        token.picture = user.image || payloadImage || token.picture;
        token.firstName = (user as any).firstName || (user as any).user?.firstName || "";
        token.lastName = (user as any).lastName || (user as any).user?.lastName || "";
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
        image:
          token.picture ||
          (token.user as { profileImage?: string | null } | undefined)?.profileImage ||
          session.user?.image ||
          null,
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
    secret: AUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: AUTH_SECRET,
};
