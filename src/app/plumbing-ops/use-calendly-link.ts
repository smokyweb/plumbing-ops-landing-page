"use client";

import { useSearchParams } from "next/navigation";

const CALENDLY_LINKS: Record<string, string> = {
  archer: "https://calendly.com/archer-bluestoneapps/plumbcontrol-demo",
  jared:  "https://calendly.com/jared-bluestoneapps/plumbcontrol-demo",
  // default (no param)
  default: "https://calendly.com/bluestoneapps/plumbcontrol",
};

export function useCalendlyLink(): string {
  const params = useSearchParams();
  
  // Check ?rep=archer or ?archer (key with no value)
  const rep = params.get("rep") 
    ?? (params.has("archer") ? "archer" : null)
    ?? (params.has("jared")  ? "jared"  : null);

  return CALENDLY_LINKS[rep?.toLowerCase() ?? "default"] ?? CALENDLY_LINKS.default;
}
