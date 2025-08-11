// app/page.tsx (HomePage)
"use client";

import HeroSection from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";

export default function HomePage() {
  return (
    <div className="px-4 max-w-7xl mx-auto">
      <HeroSection />
      <HowItWorks />
    </div>
  );
}
