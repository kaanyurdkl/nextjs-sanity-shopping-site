/**
 * Format a 10-digit Canadian phone number for display
 * Input: "6044403922"
 * Output: "+1 (604) 440-3922"
 */
export function formatCanadianPhoneNumber(phoneNumber: string | null): string {
  if (!phoneNumber) return "Not provided";

  // Remove any non-digit characters (in case there are any)
  const digits = phoneNumber.replace(/\D/g, "");

  // Ensure we have exactly 10 digits
  if (digits.length !== 10) return phoneNumber;

  // Format: +1 (XXX) XXX-XXXX
  const areaCode = digits.slice(0, 3);
  const firstPart = digits.slice(3, 6);
  const secondPart = digits.slice(6, 10);

  return `+1 (${areaCode}) ${firstPart}-${secondPart}`;
}
