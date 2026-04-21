"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  FileText,
  Camera,
  MapPin,
  Star,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: LayoutDashboard,
    title: "Dispatch Board",
    description:
      "See every truck, tech, and job on one screen with real-time status updates. Drag-and-drop scheduling lets you reassign jobs in seconds when priorities change.",
  },
  {
    icon: Package,
    title: "Van Inventory",
    description:
      "Track parts and materials across every truck in your fleet in real time. Never lose a job because a tech showed up without the right fitting.",
  },
  {
    icon: FileText,
    title: "In-Field Quoting",
    description:
      "Give techs the power to present Good/Better/Best pricing options on-site, increasing average ticket value. Quotes are generated from your pre-set pricing rules — no guesswork, no callbacks.",
  },
  {
    icon: Camera,
    title: "Job Photo Vault",
    description:
      "Every photo taken on a job is automatically tagged, timestamped, and linked to the work order. Build a visual history that protects you from disputes and impresses customers.",
  },
  {
    icon: MapPin,
    title: "GPS Time Tracking",
    description:
      "Know exactly when techs arrive and leave each job site with automated GPS clock-in/out. Eliminate timecard disputes and get accurate labor costing per job.",
  },
  {
    icon: Star,
    title: "Review Autopilot",
    description:
      "Automatically request reviews from happy customers at the perfect moment after job completion. Route 5-star reviews to Google and intercept negative feedback before it goes public.",
  },
  {
    icon: Target,
    title: "Lead Source Attribution",
    description:
      "Track every lead from first touch to closed job so you know exactly which marketing channels drive revenue. Stop wasting money on ads that don't convert.",
  },
  {
    icon: Users,
    title: "Membership Manager",
    description:
      "Manage recurring service agreements with automated billing, renewal reminders, and scheduling. Turn one-time customers into predictable monthly revenue.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

export function FeatureGrid() {
  const [selected, setSelected] = useState<Feature | null>(null);

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything your shop needs.{" "}
            <span className="text-muted-foreground">Nothing it doesn&apos;t.</span>
          </h2>
          <p className="text-muted-foreground">
            Click any feature to learn more.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <motion.button
              key={feature.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              onClick={() => setSelected(feature)}
              className="group cursor-pointer rounded-xl border border-border bg-card p-6 text-left transition-colors hover:border-accent/40 hover:bg-accent/5"
            >
              <feature.icon className="mb-3 h-6 w-6 text-accent transition-transform group-hover:scale-110" />
              <h3 className="text-sm font-semibold text-card-foreground">
                {feature.title}
              </h3>
            </motion.button>
          ))}
        </div>

        <Dialog
          open={selected !== null}
          onOpenChange={(open) => !open && setSelected(null)}
        >
          <DialogContent>
            {selected && (
              <>
                <DialogHeader>
                  <div className="mb-2 flex items-center gap-3">
                    <selected.icon className="h-6 w-6 text-accent" />
                    <DialogTitle>{selected.title}</DialogTitle>
                  </div>
                  <DialogDescription>{selected.description}</DialogDescription>
                </DialogHeader>
                <div className="mt-4 flex aspect-video items-center justify-center rounded-lg border border-border bg-muted">
                  <img
                    src={`/screenshots/${selected.title.toLowerCase().replace(/\s+/g, "-")}.png`}
                    alt={`${selected.title} screenshot`}
                    className="hidden"
                  />
                  <p className="text-sm text-muted-foreground">
                    Screenshot coming soon
                  </p>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
