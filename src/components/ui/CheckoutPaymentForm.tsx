"use client";

import { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";

export default function CheckoutPaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    // TODO: Create PaymentIntent on server and get client secret
    // For now, just show a placeholder message
    console.log("Payment form submitted");

    setIsProcessing(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border p-4 space-y-4">
        <h3 className="font-bold text-lg">Card Information</h3>
        <PaymentElement />
        {errorMessage && (
          <div className="text-sm text-red-600">{errorMessage}</div>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={!stripe || isProcessing}>
        {isProcessing ? "Processing..." : "Complete Order"}
      </Button>
    </form>
  );
}
