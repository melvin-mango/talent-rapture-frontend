// app/api/events/route.ts
import { NextRequest, NextResponse } from "next/server";
import { EventsResponse, ApiResponse } from "@/lib/types";

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL;

export async function GET(request: NextRequest) {
  try {
    if (!PAYLOAD_URL) {
      console.error('Backend URL is not configured');
      return NextResponse.json(
        {
          success: false,
          error: "Backend URL is not configured",
        } as ApiResponse<null>,
        { status: 500 }
      );
    }

    const fetchUrl = `${PAYLOAD_URL}/api/events?depth=1&sort=-date`;
    console.log('Fetching from Strapi:', fetchUrl);

    // Fetch events from Strapi with media relations
    const payloadResponse = await fetch(fetchUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log('Strapi response status:', payloadResponse.status);

    if (!payloadResponse.ok) {
      const errorData = await payloadResponse.json().catch(() => ({}));
      console.error('Strapi error:', errorData);
      return NextResponse.json(
        {
          success: false,
          error: errorData.error?.message || "Failed to fetch events ",
        } as ApiResponse<null>,
        { status: payloadResponse.status }
      );
    }

    const eventsData: EventsResponse = await payloadResponse.json();
    console.log('Events retrieved:', eventsData.docs?.length || 0);

    return NextResponse.json(
      {
        success: true,
        data: eventsData.docs,
      } as ApiResponse<EventsResponse["docs"]>,
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching events:", error);
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
