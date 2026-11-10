"use client";

import { ChevronsUpDownIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import type { StoredSkill } from "@/db";
import { cn } from "@/lib/utils";

export function ProjectStackField({
  skills,
  value,
  onChange,
}: {
  skills: StoredSkill[];
  value: string[];
  onChange: (stack: string[]) => void;
}) {
  const options = [
    ...new Set(skills.map((skill) => skill.name.trim()).filter(Boolean)),
  ];
  const selected = value.map((item) => item.trim()).filter(Boolean);
  const orphanSelected = selected.filter((item) => !options.includes(item));
  const menuOptions = [...options, ...orphanSelected];

  function toggle(name: string, checked: boolean) {
    if (checked) {
      if (selected.includes(name)) return;
      onChange([...selected, name]);
      return;
    }
    onChange(selected.filter((item) => item !== name));
  }

  return (
    <div className="grid gap-2">
      <Label>Stack</Label>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "h-10 w-full justify-between px-2.5 font-normal",
          )}
          disabled={menuOptions.length === 0}
        >
          <span className="truncate text-left">
            {selected.length > 0 ? selected.join(", ") : "Select skills…"}
          </span>
          <ChevronsUpDownIcon className="size-4 shrink-0 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[var(--anchor-width)] min-w-56">
          <DropdownMenuGroup>
            <DropdownMenuLabel>From Skills</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {menuOptions.length === 0 ? (
              <p className="px-2 py-3 text-sm text-muted-foreground">
                Add skills in the Skills tab first.
              </p>
            ) : (
              menuOptions.map((name) => (
                <DropdownMenuCheckboxItem
                  key={name}
                  checked={selected.includes(name)}
                  onCheckedChange={(checked) => toggle(name, checked === true)}
                >
                  {name}
                </DropdownMenuCheckboxItem>
              ))
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {selected.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((name) => (
            <button
              key={name}
              type="button"
              className="rounded-md border border-border bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => toggle(name, false)}
              title={`Remove ${name}`}
            >
              {name} ×
            </button>
          ))}
        </div>
      ) : null}
      {options.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          Stack options come from the Skills tab.
        </p>
      ) : null}
    </div>
  );
}
