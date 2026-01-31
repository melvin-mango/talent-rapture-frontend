// app/api/event-registrations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { EventRegistration, EventRegistrationRequest, EventRegistrationsResponse, ApiResponse } from "@/lib/types";
import jwt from "jsonwebtoken";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const STRAPI_ADMIN_TOKEN = process.env.STRAPI_ADMIN_TOKEN;
const JWT_SECRET = process.env.NEXTAUTH_SECRET || "your-secret-key";

// GET - Fetch user's registrations for a specific event (filtered by current user)
export async function GET(request: NextRequest) {
  try {
    if (!STRAPI_URL) {
      return NextResponse.json(
        {
          success: false,
          error: "Strapi URL is not configured",
        } as ApiResponse<null>,
        { status: 500 }
      );
    }

    // Get user ID from JWT token
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized - no token provided",
        } as ApiResponse<null>,
        { status: 401 }
      );
    }

    let userId: string | null = null;
    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      userId = decoded.id || decoded.sub;
    } catch (error) {
      console.error("JWT verification failed:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized - invalid token",
        } as ApiResponse<null>,
        { status: 401 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized - no user ID in token",
        } as ApiResponse<null>,
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");

    if (!eventId) {
      return NextResponse.json(
        {
          success: false,
          error: "Event ID is required",
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Fetch ONLY the current user's registrations for this event
    const fetchUrl = `${STRAPI_URL}/api/event-registrations?filters[event][documentId][$eq]=${eventId}&filters[users_permissions_user][id][$eq]=${userId}&populate[event][fields][0]=title&populate[users_permissions_user][fields][0]=email&sort=createdAt:desc`;
    
    console.log("Fetching registrations for user:", userId, "event:", eventId);

    const strapiResponse = await fetch(fetchUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(STRAPI_ADMIN_TOKEN && {
          Authorization: `Bearer ${STRAPI_ADMIN_TOKEN}`,
        }),
      },
    });

    console.log("Strapi response status:", strapiResponse.status);

    if (!strapiResponse.ok) {
      const errorData = await strapiResponse.json().catch(() => ({}));
      console.error("Strapi error:", errorData);
      return NextResponse.json(
        {
          success: false,
          error: errorData.error?.message || "Failed to fetch registrations",
        } as ApiResponse<null>,
        { status: strapiResponse.status }
      );
    }

    const registrationsData: EventRegistrationsResponse = await strapiResponse.json();
    console.log("Registrations retrieved:", registrationsData.data?.length || 0);

    return NextResponse.json(
      {
        success: true,
        data: registrationsData.data,
      } as ApiResponse<EventRegistrationsResponse["data"]>,
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}

// POST - Create a new event registration
export async function POST(request: NextRequest) {
  try {
    if (!STRAPI_URL) {
      return NextResponse.json(
        {
          success: false,
          error: "Strapi URL is not configured",
        } as ApiResponse<null>,
        { status: 500 }
      );
    }

    const body: any = await request.json();

    console.log("Received registration body:", body);

    // Validation
    if (!body.phone || !body.physicalAddress || !body.numberOfParticipants || !body.event || !body.userId) {
      console.error("Missing required fields:", {
        phone: !!body.phone,
        physicalAddress: !!body.physicalAddress,
        numberOfParticipants: !!body.numberOfParticipants,
        event: !!body.event,
        userId: !!body.userId,
      });
      return NextResponse.json(
        {
          success: false,
          error: "All fields including event and userId are required",
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    if (body.numberOfParticipants < 1) {
      return NextResponse.json(
        {
          success: false,
          error: "Number of participants must be at least 1",
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    const fetchUrl = `${STRAPI_URL}/api/event-registrations`;
    
    console.log("Creating registration at:", fetchUrl);
    console.log("Registration data:", {
      phone: body.phone,
      physicalAddress: body.physicalAddress,
      numberOfParticipants: body.numberOfParticipants,
      event: body.event,
      users_permissions_user: body.userId,
    });

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
          phone: body.phone,
          physicalAddress: body.physicalAddress,
          numberOfParticipants: body.numberOfParticipants,
          event: body.event,
          users_permissions_user: body.userId,
        },
      }),
    });

    console.log("Strapi response status:", strapiResponse.status);

    if (!strapiResponse.ok) {
      const errorData = await strapiResponse.json().catch(() => ({}));
      console.error("Strapi error:", errorData);
      console.error("Strapi response body:", JSON.stringify(errorData, null, 2));
      return NextResponse.json(
        {
          success: false,
          error: errorData.error?.message || "Failed to create registration",
        } as ApiResponse<null>,
        { status: strapiResponse.status }
      );
    }

    const registrationData: { data: EventRegistration } = await strapiResponse.json();
    console.log("Registration created:", registrationData.data.id);
    console.log("Full registration data:", registrationData.data);

    return NextResponse.json(
      {
        success: true,
        data: registrationData.data,
      } as ApiResponse<EventRegistration>,
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating registration:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
