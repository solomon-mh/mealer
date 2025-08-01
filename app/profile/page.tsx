"use client";

import { Spinner } from "@/components/spinner";
import { availablePlans } from "@/lib/plan";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";
import { Toaster } from "react-hot-toast";

async function fetchSubscriptionStatus() {
  const response = await fetch("/api/profile/subscription-status");
  return response.json();
}

const ProfilePage = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  const {
    data: subscription,
    isError,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["subscription"],
    queryFn: fetchSubscriptionStatus,
    enabled: isLoaded && isSignedIn,
    staleTime: 5 * 60 * 1000,
  });
  // Loading or Not Signed In States
  if (!isLoaded || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-emerald-100">
        <Spinner />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  const currentPlan = availablePlans.find(
    (plan) => plan.interval === subscription.subscription?.subscriptionTier
  );

  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-emerald-100">
        <p>Please sign in to view your profile.</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-100 p-4">
      <Toaster position="top-center" />{" "}
      {/* Optional: For toast notifications */}
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left Panel: Profile Information */}
          <div className="w-full md:w-1/3 p-6 bg-emerald-500 text-white flex flex-col items-center">
            <Image
              src={user.imageUrl || "/default-avatar.png"}
              alt="User Avatar"
              width={100}
              height={100}
              className="rounded-full mb-4"
            />
            <h1 className="text-2xl font-bold mb-2">
              {user.firstName} {user.lastName}
            </h1>
            <p className="mb-4">{user.primaryEmailAddress?.emailAddress}</p>
            {/* Add more profile details or edit options as needed */}
          </div>

          {/* Right Panel: Subscription Details */}
          <div className="w-full md:w-2/3 p-6 bg-gray-50">
            <h2 className="text-2xl font-bold mb-6 text-emerald-700">
              Subscription Details
            </h2>
            {isLoading ? (
              <div className="flex items-center">
                <Spinner />
                <span className="ml-2">Loading subscription details...</span>
              </div>
            ) : isError ? (
              <p className="text-red-500">{error?.message}</p>
            ) : subscription ? (
              <div className="space-y-6">
                {/* Current Subscription Info */}
                <div className="bg-white shadow-md rounded-lg p-4 border border-emerald-200">
                  <h3 className="text-xl font-semibold mb-2 text-emerald-600">
                    Current Plan
                  </h3>
                  {currentPlan ? (
                    <div className="text-gray-600">
                      <p>
                        <strong>Plan:</strong> {currentPlan.name}
                      </p>
                      <p>
                        <strong>Amount:</strong> ${currentPlan.amount}{" "}
                        {currentPlan.currency}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        {subscription.subscription.subscriptionActive
                          ? "ACTIVE"
                          : "INACTIVE"}
                      </p>
                    </div>
                  ) : (
                    <p className="text-red-500">Current plan not found.</p>
                  )}
                </div>
              </div>
            ) : (
              <p>No data</p>
            )}
            {/* Change Subscription Plan */}
            <div className="bg-white shadow-md rounded-lg p-4 border border-emerald-200">
              <h3 className="text-xl font-semibold mb-2 text-emerald-600">
                Change Subscription Plan
              </h3>
              <select
                // onChange={handleChsangePlan}
                defaultValue={currentPlan?.interval}
                className="w-full px-3 py-2 border border-emerald-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-emerald-400"
                // disabled={changePlanMutation.isPending}
              >
                <option value="" disabled>
                  Select a new plan
                </option>
                {availablePlans.map((plan, key) => (
                  <option key={key} value={plan.interval}>
                    {plan.name} - ${plan.amount} / {plan.interval}
                  </option>
                ))}
              </select>
              <button
                // onClick={handleConfirmChangePlan}
                className="mt-3 p-2 bg-emerald-500 rounded-lg text-white"
              >
                Save Change
              </button>
              {/* {changePlanMutation.isPending && (
                    <div className="flex items-center mt-2">
                      <Spinner />
                      <span className="ml-2">Updating plan...</span>
                    </div>
                  )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
