// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { LoginRequest, ApiResponse, AuthResponse, Users } from "@/lib/types";
import { handleStrapiError } from "@/lib/utils";

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL;

export async function POST(request: NextRequest) {
  try {
    if (!PAYLOAD_URL) {
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
    const payloadResponse = await fetch(`${PAYLOAD_URL}/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: body.email,
        password: body.password,
      }),
    });

    console.log("Payload login status:", payloadResponse.status);

    if (!payloadResponse.ok) {
      const errorData = await payloadResponse.json();
      const errorMessage = handleStrapiError(errorData.error || errorData);
      console.error("Payload login error:", errorData);
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: payloadResponse.status }
      );
    }

    const authData: Users = await payloadResponse.json();

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
