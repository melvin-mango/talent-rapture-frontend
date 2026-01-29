// app/api/event-registrations/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { EventRegistration, ApiResponse } from "@/lib/types";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const STRAPI_ADMIN_TOKEN = process.env.STRAPI_ADMIN_TOKEN;

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

// PATCH - Update a registration
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

    const { id } = await params;
    const body = await request.json();

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
    
    console.log("Updating registration at:", fetchUrl);

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

// DELETE - Delete a registration
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

    const { id } = await params;

    console.log("Delete request received for ID:", id);

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
