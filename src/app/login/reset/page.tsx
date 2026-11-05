import type { Metadata } from "next";
import Link from "next/link";
import { ResetForm } from "@/app/login/reset/reset-form";

export const metadata: Metadata = {
  title: "Reset password",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <main className="px-5 py-16">
      <div className="mx-auto w-full max-w-sm rounded-2xl border border-stone-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
        <h1 className="text-xl font-semibold tracking-tight">Reset password</h1>
        <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-stone-400">
          Choose a new password for your admin account.
        </p>
        <div className="mt-6">
          {token ? (
            <ResetForm token={token} />
          ) : (
            <div className="grid gap-4">
              <p className="text-sm text-red-700 dark:text-red-300">This reset link is invalid or has expired.</p>
              <Link href="/login/forgot" className="text-sm text-teal-800 hover:underline dark:text-teal-300">
                Request a new link
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
