// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const STRAPI_ADMIN_TOKEN = process.env.STRAPI_ADMIN_TOKEN;

interface ContactRequest {
  email: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    if (!STRAPI_URL) {
      return NextResponse.json(
        {
          success: false,
          error: "Strapi URL is not configured",
        },
        { status: 500 }
      );
    }

    const body: ContactRequest = await request.json();

    // Validation
    if (!body.email || !body.message) {
      return NextResponse.json(
        {
          success: false,
          error: "Email and message are required",
        },
        { status: 400 }
      );
    }

    if (!body.email.includes("@")) {
      return NextResponse.json(
        {
          success: false,
          error: "Please provide a valid email address",
        },
        { status: 400 }
      );
    }

    if (body.message.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Message cannot be empty",
        },
        { status: 400 }
      );
    }

    const fetchUrl = `${STRAPI_URL}/api/contacts`;

    console.log("Sending contact message to:", fetchUrl);
    console.log("Contact data:", { email: body.email, message: body.message.substring(0, 50) + "..." });

    const strapiResponse = await fetch(fetchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(STRAPI_ADMIN_TOKEN && {
          Authorization: `Bearer ${STRAPI_ADMIN_TOKEN}`,
        }),
      },
      body: JSON.stringify({
        data: {
          email: body.email,
          message: body.message,
        },
      }),
    });

    console.log("Strapi response status:", strapiResponse.status);

    if (!strapiResponse.ok) {
      const errorData = await strapiResponse.json().catch(() => ({}));
      console.error("Strapi error:", errorData);
      return NextResponse.json(
        {
          success: false,
          error: errorData.error?.message || "Failed to send message",
        },
        { status: strapiResponse.status }
      );
    }

    const responseData = await strapiResponse.json();
    console.log("Contact message saved successfully");

    return NextResponse.json(
      {
        success: true,
        data: responseData.data,
        message: "Your message has been sent successfully!",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error sending contact message:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
