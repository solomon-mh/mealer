import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated." },
        { status: 401 }
      );
    }

    // Check if profile already exists
    const existingProfile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      return NextResponse.json({ message: "Profile already exists." });
    }

    const userResponse = await fetch(
      `https://api.clerk.com/v1/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        },
      }
    );
    const clerkUser = await userResponse.json();

    const email = clerkUser.email_addresses?.[0]?.email_address || "";

    // Create profile
    await prisma.profile.create({
      data: {
        userId,
        email,
        subscriptionActive: false,
        subscriptionTier: null,
        stripeSubscriptionId: null,
      },
    });

    return NextResponse.json(
      { message: "Profile created successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in create-profile API:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
}
