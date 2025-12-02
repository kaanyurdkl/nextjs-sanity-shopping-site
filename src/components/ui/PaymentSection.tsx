"use client";

import { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { getStripe } from "@/services/stripe/client";
import CheckoutPaymentForm from "@/components/ui/CheckoutPaymentForm";

type CheckoutStep = "contact" | "shipping" | "payment";

export default function PaymentSection({
  currentStep,
}: {
  currentStep: CheckoutStep | undefined;
}) {
  const [clientSecret, setClientSecret] = useState<string>("");
  const isCurrent = currentStep === "payment";

  useEffect(() => {
    if (isCurrent) {
      fetch("/api/payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
          }
        })
        .catch((error) => {
          console.error("Failed to create payment intent:", error);
        });
    }
  }, [isCurrent]);

  // Don't render if we haven't reached this step
  if (!isCurrent) {
    return null;
  }

  const stripePromise = getStripe();

  const appearance = {
    theme: "flat" as const,
    variables: {
      colorPrimary: "#000000",
      colorBackground: "#ffffff",
      colorText: "#000000",
      colorDanger: "#dc2626",
      fontFamily: "system-ui, sans-serif",
      spacingUnit: "4px",
      borderRadius: "0px",
    },
    rules: {
      ".Input": {
        border: "1px solid #e5e7eb",
        padding: "12px",
      },
      ".Input:focus": {
        border: "1px solid #000000",
        outline: "none",
      },
    },
  };

  return (
    <div className="mt-6">
      <h2 className="font-bold uppercase text-xl mb-4">Payment Information</h2>
      {clientSecret ? (
        <Elements
          stripe={stripePromise}
          options={{
            appearance,
            clientSecret,
          }}
        >
          <CheckoutPaymentForm />
        </Elements>
      ) : (
        <div className="border p-4">
          <div className="w-full bg-gray-200 h-10 animate-pulse rounded"></div>
        </div>
      )}
    </div>
  );
}
