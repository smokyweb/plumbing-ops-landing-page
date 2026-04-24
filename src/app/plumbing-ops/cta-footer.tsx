"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useCalendlyLink } from "./use-calendly-link";

function fireGtagEvent(label: string) {
  window.gtag?.("event", "plumbing_ops_cta", {
    event_label: label,
  });
}

export function CtaFooter() {
  const calendlyLink = useCalendlyLink();
  return (
    <section className="px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-accent/20 bg-accent/5 text-center"
      >
        <Image
          src="/plumbers-team.jpg"
          alt="PlumbControl team in the field"
          width={900}
          height={300}
          className="w-full object-cover"
        />
        <div className="p-12">
        <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Ready to own your software?
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
          Stop renting software that holds your data hostage. Get a system built
          for your shop — and keep it forever.
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button
            size="lg"
            onClick={() => { fireGtagEvent("book_demo"); window.open(calendlyLink, "_blank"); }}
            className="w-full cursor-pointer sm:w-auto"
          >
            Book a 20-minute demo
          </Button>
          <Button
            variant="outline"
            size="lg"
            asChild
            className="w-full sm:w-auto"
            onClick={() => fireGtagEvent("see_live_demo")}
          >
            <Link href="/plumbing-ops/demo">See the live demo</Link>
          </Button>
        </div>
        </div>
      </motion.div>
    </section>
  );
}
