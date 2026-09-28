// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { RegisterRequest, AuthResponse, Users } from "@/lib/types";
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

    const body: RegisterRequest = await request.json();
    console.log("Registration request received with body:", body);

    // Validation
    if (!body.email || !body.password || !body.firstName || !body.lastName) {
      console.log("Validation failed - Missing fields:", { email: !!body.email, password: !!body.password, firstName: !!body.firstName, lastName: !!body.lastName });
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    if (body.password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Create the user through Payload's auth collection endpoint.
    const payloadResponse = await fetch(`${PAYLOAD_URL}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: body.email,
        password: body.password,
        username: body.email.split("@")[0],
        firstName: body.firstName,
        lastName: body.lastName,
      }),
    });

    if (!payloadResponse.ok) {
      let errorData;
      const contentType = payloadResponse.headers.get("content-type");
      
      try {
        if (contentType?.includes("application/json")) {
          errorData = await payloadResponse.json();
        } else {
          errorData = await payloadResponse.text();
        }
      } catch (parseError) {
        errorData = `HTTP ${payloadResponse.status}`;
      }

      console.error("Strapi registration error:", {
        status: payloadResponse.status,
        statusText: payloadResponse.statusText,
        body: errorData,
      });

      const errorMessage =
        typeof errorData === "string"
          ? errorData
          : handleStrapiError(errorData?.error || errorData || "Registration failed");

      return NextResponse.json(
        {
          success: false,
          error: errorMessage || "Registration failed",
          debug: errorData,
        },
        { status: payloadResponse.status }
      );
    }

    const payloadData = await payloadResponse.json();
    const user: Users = payloadData.user || payloadData.doc || payloadData;
    const authData: AuthResponse = { user };
    console.log("User registered:", { id: user.id, email: user.email });

    return NextResponse.json(
      {
        success: true,
        data: authData,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
