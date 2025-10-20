"use client";

import { useState, useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  updateProfile,
  type ProfileFormState,
} from "@/app/(main)/account/actions";
import type { USER_BY_GOOGLE_ID_QUERYResult } from "@/sanity/types/sanity.types";

interface ProfileTabProps {
  user: NonNullable<USER_BY_GOOGLE_ID_QUERYResult>;
}

export default function ProfileTab({ user }: ProfileTabProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [state, formAction, isPending] = useActionState<
    ProfileFormState,
    FormData
  >(updateProfile, {});

  // Track previous success state to detect changes
  const prevSuccessRef = useRef(state.success);

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  // Handle successful update - close edit mode and force refresh
  useEffect(() => {
    const successChanged = state.success && !prevSuccessRef.current;

    if (successChanged && isEditing) {
      setIsEditing(false);
      // Force client-side refresh to refetch server data
      // This is needed because revalidatePath doesn't always trigger immediate refetch
      router.refresh();
    }

    // Update the previous success state
    prevSuccessRef.current = state.success;
  }, [state.success, isEditing, router]);

  return (
    <div>
      <h2 className="text-2xl font-bold uppercase mb-6">Profile</h2>

      <div className="border p-6">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-xl font-bold">Personal Information</h3>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="underline text-sm hover:no-underline"
            >
              Edit
            </button>
          )}
        </div>

        {/* Success Message */}
        {state.success && (
          <div
            className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 text-sm"
            role="alert"
            aria-live="polite"
          >
            {state.message}
          </div>
        )}

        {/* Error Message */}
        {state.success === false && state.message && (
          <div
            className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-sm"
            role="alert"
            aria-live="assertive"
          >
            {state.message}
          </div>
        )}

        {!isEditing ? (
          // VIEW MODE
          <dl className="space-y-4">
            <div>
              <dt className="text-sm text-gray-600 mb-1">Full Name</dt>
              <dd className="text-base">
                {user.firstName} {user.lastName}
              </dd>
            </div>

            <div>
              <dt className="text-sm text-gray-600 mb-1">Phone Number</dt>
              <dd className="text-base">
                {user.phoneNumber || "Not provided"}
              </dd>
            </div>

            <div>
              <dt className="text-sm text-gray-600 mb-1">Email Address</dt>
              <dd className="text-base">{user.email}</dd>
            </div>
          </dl>
        ) : (
          // EDIT MODE
          <form action={formAction}>
            <div className="space-y-4">
              {/* First Name Field */}
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm text-gray-600 mb-2"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  defaultValue={user.firstName}
                  disabled={isPending}
                  className="w-full border border-black px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-invalid={!!state.errors?.firstName}
                  aria-describedby={
                    state.errors?.firstName ? "firstName-error" : undefined
                  }
                />
                {state.errors?.firstName && (
                  <p id="firstName-error" className="mt-1 text-sm text-red-600">
                    {state.errors.firstName[0]}
                  </p>
                )}
              </div>

              {/* Last Name Field */}
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm text-gray-600 mb-2"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  defaultValue={user.lastName}
                  disabled={isPending}
                  className="w-full border border-black px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-invalid={!!state.errors?.lastName}
                  aria-describedby={
                    state.errors?.lastName ? "lastName-error" : undefined
                  }
                />
                {state.errors?.lastName && (
                  <p id="lastName-error" className="mt-1 text-sm text-red-600">
                    {state.errors.lastName[0]}
                  </p>
                )}
              </div>

              {/* Phone Number Field */}
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm text-gray-600 mb-2"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  defaultValue={user.phoneNumber || ""}
                  disabled={isPending}
                  className="w-full border border-black px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-invalid={!!state.errors?.phoneNumber}
                  aria-describedby={
                    state.errors?.phoneNumber ? "phoneNumber-error" : undefined
                  }
                />
                {state.errors?.phoneNumber && (
                  <p
                    id="phoneNumber-error"
                    className="mt-1 text-sm text-red-600"
                  >
                    {state.errors.phoneNumber[0]}
                  </p>
                )}
              </div>

              {/* Email Address Field (Disabled) */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm text-gray-600 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  defaultValue={user.email}
                  disabled
                  className="w-full border border-black px-3 py-2 bg-gray-100 cursor-not-allowed"
                  aria-readonly="true"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-2">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-black text-white px-8 py-2 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? "SAVING..." : "SAVE"}
                </Button>
                <Button
                  type="button"
                  onClick={handleCancel}
                  disabled={isPending}
                  variant="outline"
                  className="border border-black bg-white text-black px-8 py-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  CANCEL
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
