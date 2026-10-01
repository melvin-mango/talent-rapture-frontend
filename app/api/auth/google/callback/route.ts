import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { success: false, error: "Google authentication is handled by NextAuth and Payload." },
    { status: 410 }
  );
}