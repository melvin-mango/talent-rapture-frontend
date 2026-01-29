// app/api/events/route.ts
import { NextRequest, NextResponse } from "next/server";
import { EventsResponse, ApiResponse } from "@/lib/types";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

export async function GET(request: NextRequest) {
  try {
    if (!STRAPI_URL) {
      console.error('Strapi URL is not configured');
      return NextResponse.json(
        {
          success: false,
          error: "Strapi URL is not configured",
        } as ApiResponse<null>,
        { status: 500 }
      );
    }

    const fetchUrl = `${STRAPI_URL}/api/events?populate[image][fields][0]=url&populate[image][fields][1]=name&populate[flyer][fields][0]=url&populate[flyer][fields][1]=name&sort=date:desc`;
    console.log('Fetching from Strapi:', fetchUrl);

    // Fetch events from Strapi with media relations
    const strapiResponse = await fetch(fetchUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log('Strapi response status:', strapiResponse.status);

    if (!strapiResponse.ok) {
      const errorData = await strapiResponse.json().catch(() => ({}));
      console.error('Strapi error:', errorData);
      return NextResponse.json(
        {
          success: false,
          error: errorData.error?.message || "Failed to fetch events from Strapi",
        } as ApiResponse<null>,
        { status: strapiResponse.status }
      );
    }

    const eventsData: EventsResponse = await strapiResponse.json();
    console.log('Events retrieved:', eventsData.data?.length || 0);

    return NextResponse.json(
      {
        success: true,
        data: eventsData.data,
      } as ApiResponse<EventsResponse["data"]>,
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
