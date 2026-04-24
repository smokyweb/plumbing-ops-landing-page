import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PlumbControl — Live Demo",
  description: "See PlumbControl in action. A live walkthrough of the dispatch board, quoting, and operations features built for plumbing companies.",
};

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-2xl font-extrabold tracking-tight text-accent">PlumbControl</span>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Live Demo
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          The interactive demo is being set up. In the meantime, book a
          personalized 20-minute walkthrough and we&apos;ll show you exactly
          how PlumbControl works for your shop.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="https://calendly.com/bluestoneapps/plumbcontrol"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-lg bg-accent px-8 py-3 text-base font-medium text-accent-foreground transition hover:bg-accent/90"
          >
            Book a walkthrough
          </a>
          <Link
            href="/plumbing-ops"
            className="inline-flex items-center justify-center rounded-lg border border-border px-8 py-3 text-base font-medium transition hover:bg-muted"
          >
            ← Back to overview
          </Link>
        </div>
      </div>
    </main>
  );
}
