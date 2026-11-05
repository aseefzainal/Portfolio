"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestPasswordReset, type ForgotState } from "@/app/login/forgot/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const initial: ForgotState = { error: "", message: "" };

export function ForgotForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, initial);

  return (
    <form action={action} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" className="h-10" />
      </div>
      {state.error ? (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}
      {state.message ? (
        <Alert>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      ) : null}
      {state.resetUrl ? (
        <Alert>
          <AlertDescription className="break-all">
            Dev only:{" "}
            <a href={state.resetUrl} className="underline">
              {state.resetUrl}
            </a>
          </AlertDescription>
        </Alert>
      ) : null}
      <Button type="submit" disabled={pending} className="h-10 w-full">
        {pending ? "Sending…" : "Send reset link"}
      </Button>
      <Link
        href="/login"
        className={cn(buttonVariants({ variant: "link" }), "h-auto justify-center p-0")}
      >
        Back to sign in
      </Link>
    </form>
  );
}
