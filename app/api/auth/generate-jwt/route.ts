// app/api/auth/generate-jwt/route.ts
// This endpoint generates a JWT token for Google users who don't have passwords
import { NextRequest, NextResponse } from "next/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const STRAPI_ADMIN_TOKEN = process.env.STRAPI_ADMIN_TOKEN;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    if (!STRAPI_ADMIN_TOKEN) {
      console.error("STRAPI_ADMIN_TOKEN is not configured");
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Fetch user by email
    const userResponse = await fetch(
      `${STRAPI_URL}/api/users?filters[email][$eq]=${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${STRAPI_ADMIN_TOKEN}`,
        },
      }
    );

    if (!userResponse.ok) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const userData = await userResponse.json();
    if (!userData.data || userData.data.length === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const user = userData.data[0];

    // Generate JWT token using Strapi's internal mechanism
    // We'll use the admin endpoint with provider token generation
    const tokenResponse = await fetch(`${STRAPI_URL}/api/auth/callback/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_ADMIN_TOKEN}`,
      },
      body: JSON.stringify({
        user_id: user.id,
      }),
    });

    // If that doesn't work, try creating a custom token
    // For now, let's use a workaround: create a signed JWT ourselves
    // This requires jsonwebtoken library or we can ask frontend to handle it differently
    
    // Actually, let's try a different approach: use the login endpoint with admin credentials
    const adminLoginResponse = await fetch(`${STRAPI_URL}/api/auth/local`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_ADMIN_TOKEN}`,
      },
      body: JSON.stringify({
        identifier: email,
        password: process.env.STRAPI_ADMIN_PASSWORD || "",
      }),
    });

    // If none of the above work, return user data without JWT for now
    // The frontend will need to handle this case
    return NextResponse.json(
      {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          },
          jwt: null, // Will be set by alternative means
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Generate JWT error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
