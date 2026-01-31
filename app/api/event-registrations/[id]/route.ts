// app/api/event-registrations/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { EventRegistration, ApiResponse } from "@/lib/types";
import jwt from "jsonwebtoken";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const STRAPI_ADMIN_TOKEN = process.env.STRAPI_ADMIN_TOKEN;
const JWT_SECRET = process.env.NEXTAUTH_SECRET || "your-secret-key";

// Helper function to verify user ownership of registration
async function verifyOwnership(registrationId: string, userId: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${STRAPI_URL}/api/event-registrations/${registrationId}?populate[users_permissions_user][fields][0]=id`,
      {
        headers: {
          "Content-Type": "application/json",
          ...(STRAPI_ADMIN_TOKEN && {
            Authorization: `Bearer ${STRAPI_ADMIN_TOKEN}`,
          }),
        },
      }
    );

    if (!response.ok) return false;

    const data: { data: any } = await response.json();
    return data.data?.users_permissions_user?.id?.toString() === userId;
  } catch (error) {
    console.error("Ownership verification error:", error);
    return false;
  }
}

// GET - Fetch a specific registration
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    const fetchUrl = `${STRAPI_URL}/api/event-registrations/${id}?populate[event][fields][0]=title&populate[users_permissions_user][fields][0]=email`;
    
    console.log("Fetching registration from:", fetchUrl);

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
          error: errorData.error?.message || "Registration not found",
        } as ApiResponse<null>,
        { status: strapiResponse.status }
      );
    }

    const registrationData: { data: EventRegistration } = await strapiResponse.json();

    return NextResponse.json(
      {
        success: true,
        data: registrationData.data,
      } as ApiResponse<EventRegistration>,
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching registration:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}

// PATCH - Update a registration (only owner can update)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await request.json();

    // Verify user owns this registration
    const isOwner = await verifyOwnership(id, userId as string);
    if (!isOwner) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden - you can only update your own registrations",
        } as ApiResponse<null>,
        { status: 403 }
      );
    }

    // Validation
    if (!body.phone && !body.physicalAddress && !body.numberOfParticipants) {
      return NextResponse.json(
        {
          success: false,
          error: "At least one field must be provided",
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    const fetchUrl = `${STRAPI_URL}/api/event-registrations/${id}`;
    
    console.log("Updating registration at:", fetchUrl, "by user:", userId);

    const strapiResponse = await fetch(fetchUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(STRAPI_ADMIN_TOKEN && {
          Authorization: `Bearer ${STRAPI_ADMIN_TOKEN}`,
        }),
      },
      body: JSON.stringify({
        data: {
          ...(body.phone && { phone: body.phone }),
          ...(body.physicalAddress && { physicalAddress: body.physicalAddress }),
          ...(body.numberOfParticipants && { numberOfParticipants: body.numberOfParticipants }),
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
          error: errorData.error?.message || "Failed to update registration",
        } as ApiResponse<null>,
        { status: strapiResponse.status }
      );
    }

    const registrationData: { data: EventRegistration } = await strapiResponse.json();
    console.log("Registration updated:", registrationData.data.id);

    return NextResponse.json(
      {
        success: true,
        data: registrationData.data,
      } as ApiResponse<EventRegistration>,
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating registration:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}

// DELETE - Delete a registration (only owner can delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // Verify user owns this registration
    const isOwner = await verifyOwnership(id, userId as string);
    if (!isOwner) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden - you can only delete your own registrations",
        } as ApiResponse<null>,
        { status: 403 }
      );
    }

    console.log("Delete request received for ID:", id, "by user:", userId);

    const fetchUrl = `${STRAPI_URL}/api/event-registrations/${id}`;
    
    console.log("Deleting registration at:", fetchUrl);

    const strapiResponse = await fetch(fetchUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(STRAPI_ADMIN_TOKEN && {
          Authorization: `Bearer ${STRAPI_ADMIN_TOKEN}`,
        }),
      },
    });

    console.log("Strapi response status:", strapiResponse.status);
    
    if (!strapiResponse.ok) {
      const errorText = await strapiResponse.text();
      console.log("Strapi response body:", errorText);
    }

    if (!strapiResponse.ok && strapiResponse.status !== 204) {
      const errorData = await strapiResponse.json().catch(() => ({}));
      console.error("Strapi error:", errorData);
      return NextResponse.json(
        {
          success: false,
          error: errorData.error?.message || "Failed to delete registration",
        } as ApiResponse<null>,
        { status: strapiResponse.status }
      );
    }

    console.log("Registration deleted:", id);

    return NextResponse.json(
      {
        success: true,
        data: null,
      } as ApiResponse<null>,
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting registration:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
