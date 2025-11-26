"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Session } from "next-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  signOutAction,
  submitContactInfoAction,
} from "@/app/(main)/checkout/actions";

type StepStatus = "not-started" | "current" | "completed";

export default function CheckoutContactSection({
  session,
  status,
  email,
}: {
  session: Session | null;
  status: StepStatus;
  email?: string | null;
}) {
  const user = session?.user;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Don't render if step hasn't started yet
  if (status === "not-started") {
    return null;
  }

  // Show summary if completed
  if (status === "completed") {
    return (
      <div className="mb-6 border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold uppercase text-sm">Contact</h2>
            <p className="text-sm">{email}</p>
          </div>
          <Button variant="link" className="p-0 h-auto">
            Edit
          </Button>
        </div>
      </div>
    );
  }

  // Show full form if current

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const emailToSave = user?.email || email;

    startTransition(async () => {
      await submitContactInfoAction(emailToSave);
    });
  };

  return (
    <div>
      <h2 className="font-bold uppercase text-xl mb-4">Contact Information</h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {user ? (
            <div className="border p-4 space-y-4">
              <div className="flex justify-between">
                <h3 className="font-bold text-lg">You are signed in!</h3>
                <Button
                  variant="link"
                  className="p-0 h-auto"
                  formAction={signOutAction}
                >
                  Sign out
                </Button>
              </div>
              <p>
                You are signed in as{" "}
                <span className="font-bold">{user.email}</span>
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="border p-4 space-y-4">
                <h3 className="font-bold text-lg">Guest Checkout</h3>
                <p>Checkout without an account</p>
                <div>
                  <Label
                    htmlFor="email"
                    className="mb-1 uppercase font-bold text-xs"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@gmail.com"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center gap-x-4">
                <span className="inline-block h-0.5 w-full border-b"></span>
                <span>or</span>
                <span className="inline-block h-0.5 w-full border-b"></span>
              </div>
              <div className="border p-4 space-y-4">
                <h3 className="font-bold text-lg">User Checkout</h3>
                <p>Log in for faster checkout</p>
                <Button asChild className="w-full uppercase">
                  <Link href="/signin?callbackUrl=/checkout">Login</Link>
                </Button>
              </div>
            </div>
          )}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Processing..." : "Continue to Shipping"}
          </Button>
        </div>
      </form>
    </div>
  );
}
