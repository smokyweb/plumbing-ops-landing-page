import type { Metadata } from "next";
import { Hero } from "./hero";
import { Problem } from "./problem";
import { RoiCalculator } from "./roi-calculator";
import { FeatureGrid } from "./feature-grid";
import { CtaFooter } from "./cta-footer";

export const metadata: Metadata = {
  title: "Plumbing Ops Software — Own It, Don't Rent It | Bluestone Apps",
  description:
    "Custom-built operations software for plumbing companies with 3-25 trucks. Replace ServiceTitan, Housecall Pro, and FieldEdge with software you own — no per-seat fees, no vendor lock-in.",
};

export default function PlumbingOpsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Hero />
      <Problem />
      <RoiCalculator />
      <FeatureGrid />
      <CtaFooter />
    </main>
  );
}
