"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestPasswordReset, type ForgotState } from "@/app/login/forgot/actions";

const initial: ForgotState = { error: "", message: "" };

export function ForgotForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, initial);

  return (
    <form action={action} className="grid gap-4">
      <label className="grid gap-2 text-sm font-medium">
        Email
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="h-10 rounded-md border border-stone-300 bg-white px-3 font-normal dark:border-white/15 dark:bg-stone-950"
        />
      </label>
      {state.error ? <p className="text-sm text-red-700 dark:text-red-300">{state.error}</p> : null}
      {state.message ? <p className="text-sm text-stone-600 dark:text-stone-400">{state.message}</p> : null}
      {state.resetUrl ? (
        <p className="break-all text-sm text-teal-800 dark:text-teal-300">
          Dev only:{" "}
          <a href={state.resetUrl} className="underline">
            {state.resetUrl}
          </a>
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="h-10 rounded-md bg-teal-800 text-sm font-medium text-white disabled:opacity-60 dark:bg-teal-300 dark:text-stone-950"
      >
        {pending ? "Sending…" : "Send reset link"}
      </button>
      <Link href="/login" className="text-center text-sm text-teal-800 hover:underline dark:text-teal-300">
        Back to sign in
      </Link>
    </form>
  );
}
