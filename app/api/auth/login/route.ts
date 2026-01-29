// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { LoginRequest, ApiResponse, AuthResponse } from "@/lib/types";
import { handleStrapiError } from "@/lib/utils";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

export async function POST(request: NextRequest) {
  try {
    if (!STRAPI_URL) {
      return NextResponse.json(
        { success: false, error: "Strapi URL is not configured" },
        { status: 500 }
      );
    }

    const body: LoginRequest = await request.json();

    // Validation
    if (!body.email || !body.password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Call Strapi login endpoint
    const strapiResponse = await fetch(`${STRAPI_URL}/api/auth/local`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier: body.email, // Strapi uses 'identifier' for email/username
        password: body.password,
      }),
    });

    if (!strapiResponse.ok) {
      const errorData = await strapiResponse.json();
      const errorMessage = handleStrapiError(errorData.error || errorData);

      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: strapiResponse.status }
      );
    }

    const authData: AuthResponse = await strapiResponse.json();

    return NextResponse.json(
      {
        success: true,
        data: authData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
