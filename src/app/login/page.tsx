import type { Metadata } from "next";
import { LoginForm } from "@/app/login/login-form";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <main className="px-5 py-16">
      <div className="mx-auto w-full max-w-sm rounded-2xl border border-stone-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
        <h1 className="text-xl font-semibold tracking-tight">Admin sign in</h1>
        <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-stone-400">
          Sign in to add, edit, and remove projects.
        </p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
