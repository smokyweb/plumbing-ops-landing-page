"use client";

import { motion } from "framer-motion";
import { ClipboardX, TrendingUp, Lock } from "lucide-react";

const problems = [
  {
    icon: ClipboardX,
    title: "Whiteboards don't scale",
    pain: "Manual processes bottleneck growth.",
    detail: "Hard to track real-time job status.",
  },
  {
    icon: TrendingUp,
    title: "Your SaaS bill grows faster than your revenue",
    pain: "Per-seat pricing kills profit margins.",
    detail: "Vendor lock-in means endless price hikes.",
  },
  {
    icon: Lock,
    title: "Your data isn't yours",
    pain: "Exporting data feels like pulling teeth.",
    detail: "Limited control over integrations and custom features.",
  },
] as const;

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.15, ease: "easeOut" as const },
  }),
};

export function Problem() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-16 text-center text-3xl font-bold tracking-tight sm:text-4xl"
        >
          Sound familiar?
        </motion.h2>

        <div className="grid gap-8 md:grid-cols-3">
          {problems.map((problem, i) => (
            <motion.div
              key={problem.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="rounded-xl border border-border bg-card p-8"
            >
              <problem.icon className="mb-4 h-8 w-8 text-accent" />
              <h3 className="mb-3 text-xl font-semibold text-card-foreground">
                {problem.title}
              </h3>
              <p className="text-muted-foreground">{problem.pain}</p>
              <p className="mt-2 text-sm text-muted-foreground/70">
                {problem.detail}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
