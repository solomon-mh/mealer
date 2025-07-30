import { getPriceIDFromType } from "@/lib/plan";
import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POSST(request: NextRequest) {
  try {
    const { planType, userId, email } = await request.json();

    if (!planType || !userId || !email) {
      return NextResponse.json(
        {
          error: "Plan type, user id, and email are required",
        },
        { status: 400 }
      );
    }
    const allowedPlansTypes = ["week", "month", "year"];
    if (!allowedPlansTypes.includes(planType)) {
      return NextResponse.json(
        {
          error: "Invalid plan types",
        },
        {
          status: 400,
        }
      );
    }
    const priceId = getPriceIDFromType(planType);
    if (!priceId) {
      return NextResponse.json(
        {
          error: "Invalid price id",
        },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: email,
      mode: "subscription",
      metadata: {
        clerkUserId: userId,
        planType,
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscribe`,
    });

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
