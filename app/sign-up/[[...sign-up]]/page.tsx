"use client";

import { SignUp } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect_url") || "/mealplan";

  return (
    <div className="flex justify-center py-16">
      <SignUp forceRedirectUrl={redirectTo} fallbackRedirectUrl={redirectTo} />
    </div>
  );
}
