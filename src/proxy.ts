import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const proxy = auth((request) => {
  if (!request.auth) {
    const login = new URL("/login", request.nextUrl);
    login.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
