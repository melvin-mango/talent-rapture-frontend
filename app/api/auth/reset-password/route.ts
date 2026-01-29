// app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from "next/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Find user with matching reset token
    const userResponse = await fetch(
      `${STRAPI_URL}/api/users?filters[resetPasswordToken][$eq]=${encodeURIComponent(token)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!userResponse.ok) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    const userData = await userResponse.json();
    const user = userData.data && userData.data.length > 0 ? userData.data[0] : null;

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    // Check if token has expired
    const tokenExpiry = new Date(user.resetPasswordTokenExpiry);
    if (tokenExpiry < new Date()) {
      return NextResponse.json(
        { error: "Reset token has expired" },
        { status: 400 }
      );
    }

    console.log("Resetting password for user:", { id: user.id, email: user.email });

    // Update user password and clear reset token
    const updateResponse = await fetch(`${STRAPI_URL}/api/users/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        resetPasswordToken: null,
        resetPasswordTokenExpiry: null,
      }),
    });

    if (!updateResponse.ok) {
      const errorData = await updateResponse.text();
      console.error("Failed to update password:", errorData);
      return NextResponse.json(
        { error: "Failed to reset password" },
        { status: 400 }
      );
    }

    console.log("Password reset successfully for user:", { email: user.email });

    return NextResponse.json(
      { 
        success: true, 
        message: "Password has been reset successfully. You can now log in with your new password." 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "An error occurred resetting your password" },
      { status: 500 }
    );
  }
}
