// app/api/events/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Event, ApiResponse } from "@/lib/types";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

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

    // Fetch specific event from Strapi with media relations
    const strapiResponse = await fetch(
      `${STRAPI_URL}/api/events/${id}?populate[image][fields][0]=url&populate[image][fields][1]=name&populate[flyer][fields][0]=url&populate[flyer][fields][1]=name`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!strapiResponse.ok) {
      const errorData = await strapiResponse.json();
      return NextResponse.json(
        {
          success: false,
          error: errorData.error?.message || "Event not found",
        } as ApiResponse<null>,
        { status: strapiResponse.status }
      );
    }

    const eventData: { data: Event } = await strapiResponse.json();

    return NextResponse.json(
      {
        success: true,
        data: eventData.data,
      } as ApiResponse<Event>,
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Internal server error",
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
