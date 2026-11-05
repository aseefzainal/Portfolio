"use client";

import Link from "next/link";
import { useActionState } from "react";
import { resetPassword, type ResetState } from "@/app/login/reset/actions";

const initial: ResetState = { error: "" };

export function ResetForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(resetPassword, initial);

  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="token" value={token} />
      <label className="grid gap-2 text-sm font-medium">
        New password
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="h-10 rounded-md border border-stone-300 bg-white px-3 font-normal dark:border-white/15 dark:bg-stone-950"
        />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Confirm password
        <input
          name="confirm"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="h-10 rounded-md border border-stone-300 bg-white px-3 font-normal dark:border-white/15 dark:bg-stone-950"
        />
      </label>
      {state.error ? <p className="text-sm text-red-700 dark:text-red-300">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="h-10 rounded-md bg-teal-800 text-sm font-medium text-white disabled:opacity-60 dark:bg-teal-300 dark:text-stone-950"
      >
        {pending ? "Saving…" : "Update password"}
      </button>
      <Link href="/login" className="text-center text-sm text-teal-800 hover:underline dark:text-teal-300">
        Back to sign in
      </Link>
    </form>
  );
}
