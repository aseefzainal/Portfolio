import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    rememberMe?: boolean;
  }

  interface Session {
    user: DefaultSession["user"] & {
      id?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    rememberMe?: boolean;
  }
}
