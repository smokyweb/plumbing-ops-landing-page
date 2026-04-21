"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function fireGtagEvent(label: string) {
  window.gtag?.("event", "plumbing_ops_cta", {
    event_label: label,
  });
}

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 py-24">
      {/* Subtle gradient background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(14,165,233,0.08)_0%,_transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Brand name */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 text-center"
        >
          <span className="text-2xl font-extrabold tracking-tight text-accent">PlumbControl</span>
        </motion.div>

        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              Run your plumbing shop like the{" "}
              <span className="text-accent">$10M</span> guys.{" "}
              <span className="text-muted-foreground">
                Without paying like them.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg text-muted-foreground sm:text-xl">
              Custom-built, owned software for plumbing companies with 3–25 trucks.
              Replace ServiceTitan and Housecall Pro with software you own — no per-seat fees, no vendor lock-in.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                onClick={() => fireGtagEvent("book_demo")}
                className="cursor-pointer"
              >
                Book a 20-minute demo
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                onClick={() => fireGtagEvent("see_live_demo")}
              >
                <Link href="/plumbing-ops/demo">See the live demo</Link>
              </Button>
            </div>
          </motion.div>

          {/* Right — plumber image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <Image
              src="/plumber-work.jpg"
              alt="Plumber working on pipes"
              width={600}
              height={400}
              className="rounded-2xl object-cover shadow-2xl"
              priority
            />
          </motion.div>
        </div>

        {/* Fleet image strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
          className="mt-16"
        >
          <p className="mb-4 text-center text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Built for fleets like yours
          </p>
          <Image
            src="/plumbing-fleet.jpg"
            alt="Fleet of plumbing service trucks"
            width={1200}
            height={400}
            className="w-full rounded-2xl object-cover shadow-xl"
          />
        </motion.div>
      </div>
    </section>
  );
}
