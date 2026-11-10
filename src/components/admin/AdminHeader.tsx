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

export type AdminNotification = {
  id: number;
  title: string;
  preview: string;
  href: string;
  createdAt: string;
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "A";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

function formatWhen(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function AdminHeader({
  name,
  email,
  photo,
  photoShape = "circle",
  notifications = [],
  unreadCount = 0,
  logoutAction,
}: {
  name: string;
  email: string;
  photo: string;
  photoShape?: string;
  notifications?: AdminNotification[];
  unreadCount?: number;
  logoutAction: () => Promise<void>;
}) {
  const router = useRouter();
  const shapeClass = profilePhotoShapeClass(photoShape);

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-end gap-1 border-b border-border bg-background/90 px-5 backdrop-blur md:px-8">
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "relative")}
          aria-label={
            unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"
          }
        >
          <BellIcon className="size-4" />
          {unreadCount > 0 ? (
            <span className="absolute top-1 right-1 size-1.5 rounded-full bg-foreground" />
          ) : null}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel className="flex items-center justify-between gap-2">
            <span>Notifications</span>
            {unreadCount > 0 ? (
              <span className="text-xs font-normal text-muted-foreground">
                {unreadCount} unread
              </span>
            ) : null}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {notifications.length === 0 ? (
            <div className="px-2 py-6 text-center text-sm text-muted-foreground">
              No new notifications
            </div>
          ) : (
            notifications.map((item) => (
              <DropdownMenuItem
                key={item.id}
                className="items-start gap-2 py-2"
                onClick={() => {
                  router.push(item.href);
                }}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.title}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                    {item.preview}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {formatWhen(item.createdAt)}
                  </p>
                </div>
              </DropdownMenuItem>
            ))
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="justify-center text-sm"
            onClick={() => {
              router.push("/admin/messages");
            }}
          >
            View all messages
          </DropdownMenuItem>
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
          <DropdownMenuItem
            onClick={() => {
              router.push("/admin/messages");
            }}
          >
            Messages
            {unreadCount > 0 ? (
              <span className="ml-auto text-xs text-muted-foreground">{unreadCount}</span>
            ) : null}
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
