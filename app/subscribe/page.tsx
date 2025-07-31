// app/subscribe/page.tsx
"use client";

import { availablePlans } from "@/lib/plan";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast"; // Optional: For better user feedback

type SubscribeResponse = {
  message: string;
  url: string;
};
type SubscribeError = {
  error: string;
};
async function subscribeToPlan(
  planType: string,
  userId: string,
  email: string
): Promise<SubscribeResponse> {
  const response = await fetch("api/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      planType,
      userId,
      email,
    }),
  });

  if (!response.ok) {
    const errrorData: SubscribeError = await response.json();
    throw new Error(errrorData.error || "Something went wrong.");
  }
  const data: SubscribeResponse = await response.json();
  return data;
}

export default function SubscribePage() {
  const { id: userId, emailAddresses: [{ emailAddress: email } = {}] = [] } =
    useUser().user || {};
  const router = useRouter();

  const { mutate, isPending } = useMutation<
    SubscribeResponse,
    Error,
    { planType: string }
  >({
    mutationFn: async ({ planType }) => {
      if (!userId) {
        throw new Error("User not signed in");
      }
      return subscribeToPlan(planType, userId, email!);
    },
    onMutate: () => {
      toast.loading("Processing subscription...");
    },
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: () => {
      toast.error("Something went wrong.");
    },
  });
  function handleSubscribe(planType: string) {
    if (!userId) {
      router.push("/sign-up");
      return;
    }
    mutate({ planType });
  }

  return (
    <div className="px-4 py-8 sm:py-12 lg:py-16">
      <Toaster position="top-right" /> {/* Optional: For toast notifications */}
      {/* Section Header */}
      <div>
        <h2 className="text-3xl font-bold text-center mt-12 sm:text-5xl tracking-tight">
          Pricing
        </h2>
        <p className="max-w-3xl mx-auto mt-4 text-xl text-center">
          Get started on our weekly plan or upgrade to monthly or yearly when
          you’re ready.
        </p>
      </div>
      {/* Cards Container */}
      <div className="mt-12 container mx-auto space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
        {/* Map over availablePlans to render plan cards */}
        {availablePlans.map((plan, key) => (
          <div
            key={key}
            className="
              relative p-8 
              border border-gray-200 rounded-2xl shadow-sm 
              flex flex-col
              hover:shadow-md hover:scale-[1.02] 
              transition-transform duration-200 ease-out
            "
          >
            <div className="flex-1">
              {/* Conditionally render "Most popular" label */}
              {plan.isPopular && (
                <p className="absolute top-0 py-1.5 px-4 bg-emerald-500 text-white rounded-full text-xs font-semibold uppercase tracking-wide transform -translate-y-1/2">
                  Most popular
                </p>
              )}
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <p className="mt-4 flex items-baseline">
                <span className="text-5xl font-extrabold tracking-tight">
                  ${plan.amount}
                </span>
                <span className="ml-1 text-xl font-semibold">
                  /{plan.interval}
                </span>
              </p>
              <p className="mt-6">{plan.description}</p>
              <ul role="list" className="mt-6 space-y-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="flex-shrink-0 w-6 h-6 text-emerald-500"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="ml-3">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              className={`${
                plan.interval === "month"
                  ? "bg-emerald-500 text-white  hover:bg-emerald-600 "
                  : "bg-emerald-100 text-emerald-700  hover:bg-emerald-200 "
              }  mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium disabled:bg-gray-400 disabled:cursor-not-allowed`}
              onClick={() => handleSubscribe(plan.interval)}
              disabled={isPending}
            >
              {isPending ? "Please wait..." : `Subscribe ${plan.name}`}
            </button>
          </div>
        ))}
      </div>{" "}
    </div>
  );
}
