import { Session } from "next-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signOut } from "@/services/next-auth/lib";

export default function CheckoutContactSection({
  session,
}: {
  session: Session | null;
}) {
  const user = session?.user;

  return (
    <div>
      <h2 className="font-bold uppercase text-xl mb-4">Contact Information</h2>
      <div className="space-y-4">
        {user ? (
          <div className="border p-4 space-y-4">
            <div className="flex justify-between">
              <h3 className="font-bold text-lg">You are signed in!</h3>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/checkout" });
                }}
              >
                <Button variant="link" className="p-0 h-auto">
                  Sign out
                </Button>
              </form>
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
                  type="email"
                  placeholder="your.email@gmail.com"
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
              <Button className="w-full uppercase">Login</Button>
            </div>
          </div>
        )}
        <Button className="w-full">Continue to Shipping</Button>
      </div>
    </div>
  );
}
