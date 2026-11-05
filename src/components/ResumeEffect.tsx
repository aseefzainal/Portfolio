"use client";

import { useEffect } from "react";
import { initResumePreview } from "@/scripts/resume-preview";

export function ResumeEffect() {
  useEffect(() => initResumePreview(), []);
  return null;
}
