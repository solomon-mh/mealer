import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-up(.*)",
  "/subscribe(.*)",
  "/api/webhook(.*)",
  "/api/checkout(.*)",
  "/api/stripe-webhook(.*)",
  "/api/check-subscription(.*)",
]);

const isSignUpRoute = createRouteMatcher(["/sign-up(.*)"]);
const isMealPlanRoute = createRouteMatcher(["/mealplan(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const { pathname, origin, search } = req.nextUrl;

  // Allow public routes and API endpoints
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }
  // If authenticated and on sign-up -> redirect to mealplan
  if (isSignUpRoute(req) && userId) {
    return NextResponse.redirect(new URL("/mealplan", origin));
  }

  // If not authenticated and trying to access a protected route
  if (!userId) {
    // Don't overwrite if already has redirect_url in query
    if (!req.nextUrl.searchParams.has("redirect_url")) {
      const signUpUrl = new URL("/sign-up", origin);
      let destination = pathname;
      if (isSignUpRoute(req)) {
        const existingRedirect = req.nextUrl.searchParams.get("redirect_url");
        if (existingRedirect) {
          destination = existingRedirect;
        } else {
          // If we're already on sign-up with no redirect_url, default to home
          destination = "/";
        }
        // Only set redirect_url if we're not already on sign-up or if we need to preserve the original
        if (
          !isSignUpRoute(req) ||
          (isSignUpRoute(req) && destination !== pathname)
        ) {
          signUpUrl.searchParams.set("redirect_url", destination + search);
        }

        if (!isSignUpRoute(req)) {
          return NextResponse.redirect(signUpUrl);
        }
      }
    }
  }

  // Meal plan route -> check subscription
  if (isMealPlanRoute(req) && userId) {
    try {
      const response = await fetch(
        `${origin}/api/check-subscription?userId=${userId}`,
        { method: "GET", headers: { "x-middleware-bypass": "true" } }
      );

      if (!response.ok) throw new Error("API error");
      const data = await response.json();

      if (!data.subscriptionActive) {
        return NextResponse.redirect(new URL("/subscribe", origin));
      }
    } catch (error) {
      console.log(error);
      return NextResponse.redirect(new URL("/subscribe", origin));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
