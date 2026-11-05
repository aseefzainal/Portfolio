import type { Metadata } from "next";
import Link from "next/link";
import { ResetForm } from "@/app/login/reset/reset-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
    <main className="bg-background px-5 py-16">
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Reset password</CardTitle>
          <CardDescription>Choose a new password for your admin account.</CardDescription>
        </CardHeader>
        <CardContent>
          {token ? (
            <ResetForm token={token} />
          ) : (
            <div className="grid gap-4">
              <Alert variant="destructive">
                <AlertDescription>This reset link is invalid or has expired.</AlertDescription>
              </Alert>
              <Link
                href="/login/forgot"
                className={cn(buttonVariants({ variant: "link" }), "h-auto justify-start p-0")}
              >
                Request a new link
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
