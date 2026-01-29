// app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user exists in Strapi
    const userResponse = await fetch(`${STRAPI_URL}/api/users?filters[email][$eq]=${encodeURIComponent(email)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!userResponse.ok) {
      // Don't reveal if email exists or not for security
      return NextResponse.json(
        { success: true, message: "If an account exists with this email, a reset link has been sent" },
        { status: 200 }
      );
    }

    const userData = await userResponse.json();
    const user = userData.data && userData.data.length > 0 ? userData.data[0] : null;

    if (!user) {
      // Don't reveal if email exists or not for security
      return NextResponse.json(
        { success: true, message: "If an account exists with this email, a reset link has been sent" },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour from now

    console.log("Generated reset token for user:", { email, token: resetToken, expiry: resetTokenExpiry });

    // Update user with reset token in Strapi using built-in field names
    const updateResponse = await fetch(`${STRAPI_URL}/api/users/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resetPasswordToken: resetToken,
        resetPasswordTokenExpiry: resetTokenExpiry.toISOString(),
      }),
    });

    if (!updateResponse.ok) {
      console.error("Failed to update user with reset token");
      // Continue anyway - we'll try to send the email
    }

    // Send reset email via Strapi's email service
    const emailResponse = await fetch(`${STRAPI_URL}/api/email/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: email,
        from: "noreply@talentrapture.com", // Update with your email
        replyTo: "support@talentrapture.com", // Update with your email
        subject: "Password Reset Request - Talent Rapture",
        text: `
          Hi ${user.firstName || "User"},

          You requested a password reset. Click the link below to reset your password:

          ${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}

          This link will expire in 1 hour.

          If you didn't request this, please ignore this email.

          Best regards,
          Talent Rapture Team
        `,
        html: `
          <h2>Password Reset Request</h2>
          <p>Hi ${user.firstName || "User"},</p>
          <p>You requested a password reset. Click the button below to reset your password:</p>
          <p>
            <a href="${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}" 
               style="background-color: #FF7F00; color: black; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Reset Password
            </a>
          </p>
          <p>Or copy and paste this link in your browser:</p>
          <p><code>${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}</code></p>
          <p><strong>This link will expire in 1 hour.</strong></p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br/>Talent Rapture Team</p>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const emailError = await emailResponse.text();
      console.error("Failed to send reset email:", emailError);
      // Still return success to not reveal email existence
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "If an account exists with this email, a reset link has been sent" 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "An error occurred processing your request" },
      { status: 500 }
    );
  }
}
