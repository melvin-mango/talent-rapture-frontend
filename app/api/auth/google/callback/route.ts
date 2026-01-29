// app/api/auth/google/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const JWT_SECRET = process.env.NEXTAUTH_SECRET || "your-secret-key";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, lastName, image, googleId } = body;

    console.log("Google callback received with:", { email, firstName, lastName, googleId });

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    // Generate a deterministic password from googleId (same every time for same user)
    const googleAuthPassword = `google_${googleId}`;

    // Check if user exists in Strapi by searching with googleId
    const checkResponse = await fetch(`${STRAPI_URL}/api/users?filters[googleId][$eq]=${googleId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    let user = null;
    let jwtToken = null;
    
    if (checkResponse.ok) {
      const checkData = await checkResponse.json();
      user = checkData.data && checkData.data.length > 0 ? checkData.data[0] : null;
      console.log("User exists check by googleId:", { found: !!user, googleId });
    }

    // If user doesn't exist by googleId, try to create one
    if (!user) {
      console.log("Creating new user via auth/local/register");
      const username = email.split("@")[0] + Math.random().toString(36).substr(2, 5);

      const registerResponse = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password: googleAuthPassword,
          username,
        }),
      });

      if (registerResponse.ok) {
        const registerData = await registerResponse.json();
        console.log("User created successfully");
        user = registerData.user;
        jwtToken = registerData.jwt;
        console.log("JWT from registration:", !!jwtToken);
        
        // Update user with firstName, lastName, and googleId using admin token
        console.log("STRAPI_ADMIN_TOKEN available:", !!process.env.STRAPI_ADMIN_TOKEN);
        if (user && process.env.STRAPI_ADMIN_TOKEN) {
          console.log("Updating user with firstName and lastName");
          const updateResponse = await fetch(`${STRAPI_URL}/api/users/${user.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.STRAPI_ADMIN_TOKEN}`,
            },
            body: JSON.stringify({
              firstName: firstName || "Google",
              lastName: lastName || "User",
              googleId,
              provider: "google",
            }),
          });
          
          if (updateResponse.ok) {
            const updatedUser = await updateResponse.json();
            user = updatedUser;
            console.log("User updated with firstName, lastName, and googleId:", {
              firstName: user.firstName,
              lastName: user.lastName,
            });
          } else {
            const updateError = await updateResponse.text();
            console.error("Failed to update user:", updateError);
          }
        } else {
          console.log("Skipping user update - admin token not available or user not created");
        }
      } else {
        const errorText = await registerResponse.text();
        console.error("Registration failed:", errorText);
        
        // If email already taken, fetch existing user
        if (errorText.includes("already taken")) {
          console.log("User already exists, fetching by email:", email);
          try {
            const fetchUserResponse = await fetch(
              `${STRAPI_URL}/api/users?filters[email][$eq]=${encodeURIComponent(email)}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            console.log("Fetch response status:", fetchUserResponse.status);
            if (fetchUserResponse.ok) {
              const fetchUserData = await fetchUserResponse.json();
              console.log("Fetch response data:", JSON.stringify(fetchUserData, null, 2));
              
              // Strapi returns the array directly, not wrapped in {data: []}
              const usersArray = Array.isArray(fetchUserData) ? fetchUserData : (fetchUserData.data || []);
              
              if (usersArray && usersArray.length > 0) {
                user = usersArray[0];
                console.log("Existing user found by email:", user.id);
              } else {
                console.error("No user found in response data. Array length:", usersArray?.length || 0);
                console.error("Full response:", fetchUserData);
                return NextResponse.json(
                  { success: false, error: "User not found in database" },
                  { status: 400 }
                );
              }
            } else {
              const fetchErrorText = await fetchUserResponse.text();
              console.error("Failed to fetch user by email. Status:", fetchUserResponse.status);
              console.error("Response:", fetchErrorText);
              return NextResponse.json(
                { success: false, error: `Failed to fetch existing user: ${fetchErrorText}` },
                { status: 400 }
              );
            }
          } catch (fetchError) {
            console.error("Error fetching existing user:", fetchError);
            return NextResponse.json(
              { success: false, error: "Failed to fetch existing user" },
              { status: 400 }
            );
          }
        } else {
          return NextResponse.json(
            { success: false, error: `Failed to create user: ${errorText}` },
            { status: 400 }
          );
        }
      }
    }

    // If we have a user but no JWT yet (returning Google user), generate JWT directly
    if (user && !jwtToken) {
      console.log("Returning user - updating profile fields and generating JWT");

      // Update user with Google-specific fields ONLY
      const updateUserResponse = await fetch(`${STRAPI_URL}/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.STRAPI_ADMIN_TOKEN && {
            Authorization: `Bearer ${process.env.STRAPI_ADMIN_TOKEN}`,
          }),
        },
        body: JSON.stringify({
          provider: "google",
          googleId,
          firstName: firstName || user.firstName || "Google",
          lastName: lastName || user.lastName || "User",
          profileImage: image || user.profileImage,
          confirmed: true,
        }),
      });

      if (updateUserResponse.ok) {
        const updatedUser = await updateUserResponse.json();
        user = updatedUser;
        console.log("Returning user profile updated");
      } else {
        const updateError = await updateUserResponse.text();
        console.error("Failed to update returning user:", updateError);
      }

      // Generate JWT token for returning user without password authentication
      try {
        const payload = {
          id: user.id,
          email: user.email,
          username: user.username,
        };
        jwtToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
        console.log("JWT generated for returning user:", !!jwtToken);
      } catch (jwtError) {
        console.error("Failed to generate JWT:", jwtError);
      }
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Failed to create or retrieve user" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            firstName: user.firstName || firstName || "",
            lastName: user.lastName || lastName || "",
            confirmed: user.confirmed || true,
            blocked: user.blocked || false,
          },
          jwt: jwtToken,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Google callback error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
