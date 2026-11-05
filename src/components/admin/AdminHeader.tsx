"use client";

import { useRouter } from "next/navigation";
import { BellIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { profilePhotoShapeClass } from "@/lib/profile-photo";
import { cn } from "@/lib/utils";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "A";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

export function AdminHeader({
  name,
  email,
  photo,
  photoShape = "circle",
  logoutAction,
}: {
  name: string;
  email: string;
  photo: string;
  photoShape?: string;
  logoutAction: () => Promise<void>;
}) {
  const router = useRouter();
  const shapeClass = profilePhotoShapeClass(photoShape);

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-end gap-1 border-b border-border bg-background/90 px-5 backdrop-blur md:px-8">
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "relative")}
          aria-label="Notifications"
        >
          <BellIcon className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="px-2 py-6 text-center text-sm text-muted-foreground">
            No new notifications
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-9 gap-2 px-1.5")}
          aria-label="Account menu"
        >
          {photo ? (
            <img
              src={photo}
              alt=""
              className={cn("size-8 object-cover ring-1 ring-border", shapeClass)}
            />
          ) : (
            <span
              className={cn(
                "grid size-8 place-items-center bg-muted text-xs font-medium text-muted-foreground ring-1 ring-border",
                shapeClass,
              )}
            >
              {initials(name || email || "A")}
            </span>
          )}
          <span className="hidden max-w-[9rem] truncate text-sm font-medium sm:inline">
            {name || "Admin"}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <p className="truncate text-sm font-medium text-foreground">{name || "Admin"}</p>
            {email ? <p className="truncate text-xs text-muted-foreground">{email}</p> : null}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              router.push("/admin/resume?tab=profile");
            }}
          >
            Edit profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              void logoutAction();
            }}
          >
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
