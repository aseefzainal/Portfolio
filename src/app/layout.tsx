import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { MotionEffect } from "@/components/ClientEffects";
import { getSiteProfile } from "@/db";
import { getSiteUrl } from "@/lib/site-url";
import { io } from "next/cache";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  await io();
  try {
    const profile = await getSiteProfile();
    const title = `${profile.name} · ${profile.role}`;
    const description = profile.summary;
    const images =
      profile.photo.startsWith("http://") || profile.photo.startsWith("https://")
        ? [{ url: profile.photo }]
        : undefined;

    return {
      metadataBase: new URL(getSiteUrl()),
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        images,
      },
      twitter: {
        card: images ? "summary_large_image" : "summary",
        title,
        description,
        images: images?.map((image) => image.url),
      },
    };
  } catch {
    return {
      title: "Portfolio",
      description: "Personal portfolio",
    };
  }
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <body className="flex min-h-full flex-col font-sans">
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem("theme");var dark=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",dark);}catch(e){}})();`}
        </Script>
        {children}
        <MotionEffect />
      </body>
    </html>
  );
}
