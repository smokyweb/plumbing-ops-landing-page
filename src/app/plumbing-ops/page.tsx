import type { Metadata } from "next";
import { Suspense } from "react";
import { Hero } from "./hero";
import { Problem } from "./problem";
import { RoiCalculator } from "./roi-calculator";
import { StorySections } from "./story-sections";
import { FeatureGrid } from "./feature-grid";
import { CtaFooter } from "./cta-footer";

export const metadata: Metadata = {
  title: "PlumbControl — Own It, Don't Rent It",
  description:
    "PlumbControl: Custom-built operations software for plumbing companies with 2-25+ trucks. Replace ServiceTitan, Housecall Pro, and FieldEdge with software you own — no per-seat fees, no vendor lock-in.",
};

export default function PlumbingOpsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Suspense>
        <Hero />
        <StorySections />
        <Problem />
        <RoiCalculator />
        <FeatureGrid />
        <CtaFooter />
      </Suspense>
    </main>
  );
}
