import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const subscription = await prisma.profile.findUnique({
      where: { userId: clerkUser.id },
      select: { subscriptionTier: true, subscriptionActive: true },
    });
    if (!subscription) {
      return NextResponse.json({ error: "No profile found" }, { status: 400 });
    }
    return NextResponse.json({ subscription });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
