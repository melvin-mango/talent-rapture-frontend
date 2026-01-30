// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { RegisterRequest, ApiResponse, AuthResponse } from "@/lib/types";
import { handleStrapiError } from "@/lib/utils";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const STRAPI_ADMIN_TOKEN = process.env.STRAPI_ADMIN_TOKEN;

export async function POST(request: NextRequest) {
  try {
    if (!STRAPI_URL) {
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

    // Call Strapi registration endpoint
    const strapiResponse = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: body.email,
        password: body.password,
        username: body.email.split("@")[0], // Use email prefix as username
      }),
    });

    if (!strapiResponse.ok) {
      let errorData;
      const contentType = strapiResponse.headers.get("content-type");
      
      try {
        if (contentType?.includes("application/json")) {
          errorData = await strapiResponse.json();
        } else {
          errorData = await strapiResponse.text();
        }
      } catch (parseError) {
        errorData = `HTTP ${strapiResponse.status}`;
      }

      console.error("Strapi registration error:", {
        status: strapiResponse.status,
        statusText: strapiResponse.statusText,
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
        { status: strapiResponse.status }
      );
    }

    const authData: AuthResponse = await strapiResponse.json();
    console.log("User registered:", { id: authData.user.id, email: authData.user.email });

    // Update user with firstName and lastName if the fields exist in your Strapi schema
    if (body.firstName || body.lastName) {
      console.log("Updating user with firstName and lastName:", { firstName: body.firstName, lastName: body.lastName });
      const updateResponse = await fetch(
        `${STRAPI_URL}/api/users/${authData.user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(STRAPI_ADMIN_TOKEN && {
              Authorization: `Bearer ${STRAPI_ADMIN_TOKEN}`,
            }),
          },
          body: JSON.stringify({
            firstName: body.firstName,
            lastName: body.lastName,
          }),
        }
      );

      if (updateResponse.ok) {
        const updatedUser = await updateResponse.json();
        console.log("User updated successfully:", { firstName: updatedUser.firstName, lastName: updatedUser.lastName });
        authData.user = { ...authData.user, ...updatedUser };
      } else {
        const errorText = await updateResponse.text();
        console.error("User update failed:", errorText);
      }
    }

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
