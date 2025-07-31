"use client";

import { SignUp } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect_url") || "/";

  return (
    <div className="px-4 py-8 sm:py-12 lg:py-16 max-w-7xl mx-auto flex justify-center align-center">
      <SignUp forceRedirectUrl="/subscribe" afterSignOutUrl={redirectTo} />
    </div>
  );
}
