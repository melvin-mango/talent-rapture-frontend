// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL;

interface ContactRequest {
  email: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    if (!PAYLOAD_URL) {
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

    const fetchUrl = `${PAYLOAD_URL}/api/contact-submissions`;

    console.log("Sending contact message to:", fetchUrl);
    console.log("Contact data:", { email: body.email, message: body.message.substring(0, 50) + "..." });

    const payloadResponse = await fetch(fetchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: body.email.trim(),
        message: body.message.trim(),
      }),
    });

    console.log("Payload response status:", payloadResponse.status);

    if (!payloadResponse.ok) {
      const errorData = await payloadResponse.json().catch(() => ({}));
      console.error("Payload error:", errorData);
      return NextResponse.json(
        {
          success: false,
          error: errorData.errors?.[0]?.message || errorData.error?.message || "Failed to send message",
        },
        { status: payloadResponse.status }
      );
    }

    const responseData = await payloadResponse.json();
    console.log("Contact message saved successfully");

    return NextResponse.json(
      {
        success: true,
        data: responseData.doc || responseData.data || responseData,
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
