import type { Metadata } from "next";
import { ForgotForm } from "@/app/login/forgot/forgot-form";

export const metadata: Metadata = {
  title: "Forgot password",
};

export default function ForgotPasswordPage() {
  return (
    <main className="px-5 py-16">
      <div className="mx-auto w-full max-w-sm rounded-2xl border border-stone-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
        <h1 className="text-xl font-semibold tracking-tight">Forgot password</h1>
        <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-stone-400">
          Enter your admin email and we will send a reset link if it matches an account.
        </p>
        <div className="mt-6">
          <ForgotForm />
        </div>
      </div>
    </main>
  );
}
