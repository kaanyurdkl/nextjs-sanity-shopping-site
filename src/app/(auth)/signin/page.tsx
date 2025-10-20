import { signIn } from "@/services/next-auth/lib";
import { GoogleIcon } from "@/components/icons";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  return (
    <div
      className="min-h-screen flex items-center 
  justify-center"
    >
      <div
        className="p-8 border 
  w-96"
      >
        <div className="text-center mb-8">
          <div>Logo</div>
          <h1
            className="text-3xl font-bold 
  text-gray-900 mt-2"
          >
            Welcome
          </h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <form
          action={async () => {
            "use server";
            await signIn("google", {
              redirectTo: callbackUrl ?? "/",
            });
          }}
        >
          <button
            type="submit"
            className="w-full flex focus:bg-gray-700 items-center cursor-pointer justify-center gap-3 border px-4 py-3 hover:bg-black hover:text-white transition-colors"
          >
            <GoogleIcon />
            Continue with Google
          </button>
        </form>
      </div>
    </div>
  );
}
