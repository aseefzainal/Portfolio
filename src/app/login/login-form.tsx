"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login } from "@/app/login/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, { error: "" });

  return (
    <form action={action} className="grid gap-4">
      <label className="grid gap-2 text-sm font-medium">
        Email
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
          className="h-10 rounded-md border border-stone-300 bg-white px-3 font-normal dark:border-white/15 dark:bg-stone-950"
        />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Password
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="h-10 rounded-md border border-stone-300 bg-white px-3 font-normal dark:border-white/15 dark:bg-stone-950"
        />
      </label>
      <div className="flex items-center justify-between gap-3 text-sm">
        <label className="flex items-center gap-2 font-medium">
          <input
            name="rememberMe"
            type="checkbox"
            className="size-4 rounded border-stone-300 text-teal-800 dark:border-white/15"
          />
          Remember me
        </label>
        <Link href="/login/forgot" className="text-teal-800 hover:underline dark:text-teal-300">
          Forgot password?
        </Link>
      </div>
      {state.error ? <p className="text-sm text-red-700 dark:text-red-300">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="h-10 rounded-md bg-teal-800 text-sm font-medium text-white disabled:opacity-60 dark:bg-teal-300 dark:text-stone-950"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
