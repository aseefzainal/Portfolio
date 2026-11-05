"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login } from "@/app/login/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, { error: "" });

  return (
    <form action={action} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          className="h-10"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="h-10"
        />
      </div>
      <div className="flex items-center justify-between gap-3">
        <Label className="font-normal">
          <Checkbox id="rememberMe" name="rememberMe" value="on" />
          Remember me
        </Label>
        <Link href="/login/forgot" className="text-sm text-primary underline-offset-4 hover:underline">
          Forgot password?
        </Link>
      </div>
      {state.error ? (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}
      <Button type="submit" disabled={pending} className="h-10 w-full">
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
