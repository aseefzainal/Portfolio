"use client";

import { useEffect } from "react";
import { initContact } from "@/scripts/contact";
import { initHeader } from "@/scripts/header";
import { initMotion } from "@/scripts/motion";

function useStart(start: () => (() => void) | void) {
  useEffect(() => start(), [start]);
}

export function HeaderEffect() {
  useStart(initHeader);
  return null;
}

export function ContactEffect() {
  useStart(initContact);
  return null;
}

export function MotionEffect() {
  useStart(initMotion);
  return null;
}
