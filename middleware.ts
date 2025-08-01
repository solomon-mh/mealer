import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-up(.*)",
  "/subscribe(.*)",
  "/api/webhooks(.*)",
  "/api/checkout(.*)",
  "/api/stripe-webhook(.*)",
  "/api/check-subscription(.*)",
]);

const isSignUpRoute = createRouteMatcher(["/sign-up(.*)"]);
const isMealPlanRoute = createRouteMatcher(["/mealplan(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const { pathname, origin, search } = req.nextUrl;

  if (isPublicRoute(req)) {
    return NextResponse.next();
  }
  if (isSignUpRoute(req) && userId) {
    return NextResponse.redirect(new URL("/mealplan", origin));
  }

  if (!userId) {
    const hasRedirect = req.nextUrl.searchParams.has("redirect_url");
    const signUpUrl = new URL("/sign-up", origin);
    if (!hasRedirect) {
      if (isSignUpRoute(req) || isMealPlanRoute(req)) {
        signUpUrl.searchParams.set("redirect_url", pathname + search);
        console.log("signUpUrl");
        console.log(signUpUrl);
        return NextResponse.redirect(signUpUrl);
      }
    }
  }

  // Meal plan route -> check subscription
  if (isMealPlanRoute(req) && userId) {
    try {
      const response = await fetch(
        `${origin}/api/check-subscription?userId=${userId}`,
        { method: "GET" }
      );

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
