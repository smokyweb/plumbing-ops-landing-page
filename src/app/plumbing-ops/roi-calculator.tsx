"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Calculator } from "lucide-react";

const SERVICE_TITAN_PER_SEAT = 200;
const BUILD_COST = 48_000;
const MONTHLY_SUPPORT = 1_500;

function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(value);
  const springValue = useSpring(motionValue, { stiffness: 80, damping: 25 });

  useEffect(() => {
    motionValue.set(value);
  }, [motionValue, value]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${Math.round(latest).toLocaleString()}${suffix}`;
      }
    });
    return unsubscribe;
  }, [springValue, prefix, suffix]);

  return (
    <span ref={ref}>
      {prefix}
      {Math.round(value).toLocaleString()}
      {suffix}
    </span>
  );
}

export function RoiCalculator() {
  const [trucks, setTrucks] = useState(8);
  const [techsPerTruck, setTechsPerTruck] = useState(2);
  const [saasPerSeat, setSaasPerSeat] = useState(150);

  const seats = trucks * techsPerTruck;
  const serviceTitan3Year = seats * SERVICE_TITAN_PER_SEAT * 36;
  const custom3Year = BUILD_COST + MONTHLY_SUPPORT * 36;
  const savings = serviceTitan3Year - custom3Year;

  const monthlySavings = seats * saasPerSeat - MONTHLY_SUPPORT;
  const paybackMonths =
    monthlySavings > 0 ? Math.ceil(BUILD_COST / monthlySavings) : Infinity;

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Calculator className="mx-auto mb-4 h-8 w-8 text-accent" />
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            See what you&apos;d save
          </h2>
          <p className="mx-auto mb-12 max-w-xl text-muted-foreground">
            Drag the sliders to match your shop. Watch the numbers change in
            real time.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-border bg-card p-8 md:p-10"
        >
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Inputs */}
            <div className="space-y-8">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-sm font-medium text-card-foreground">
                    Number of trucks
                  </label>
                  <span className="text-sm font-semibold text-accent">
                    {trucks}
                  </span>
                </div>
                <Slider
                  value={[trucks]}
                  onValueChange={([v]) => setTrucks(v)}
                  min={3}
                  max={25}
                  step={1}
                />
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-sm font-medium text-card-foreground">
                    Avg techs per truck
                  </label>
                  <span className="text-sm font-semibold text-accent">
                    {techsPerTruck}
                  </span>
                </div>
                <Slider
                  value={[techsPerTruck]}
                  onValueChange={([v]) => setTechsPerTruck(v)}
                  min={1}
                  max={3}
                  step={1}
                />
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-sm font-medium text-card-foreground">
                    Current SaaS spend per seat
                  </label>
                  <span className="text-sm font-semibold text-accent">
                    ${saasPerSeat}/mo
                  </span>
                </div>
                <Slider
                  value={[saasPerSeat]}
                  onValueChange={([v]) => setSaasPerSeat(v)}
                  min={50}
                  max={300}
                  step={10}
                />
              </div>

              <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
                <p>
                  <strong className="text-card-foreground">{seats}</strong> total
                  seats &middot; compared against ServiceTitan at $
                  {SERVICE_TITAN_PER_SEAT}/seat/mo
                </p>
              </div>
            </div>

            {/* Results */}
            <div className="flex flex-col justify-center gap-8">
              <div className="rounded-xl border border-accent/20 bg-accent/5 p-6">
                <p className="mb-1 text-sm font-medium text-muted-foreground">
                  3-year savings vs. ServiceTitan
                </p>
                <p className="text-4xl font-bold text-accent">
                  <AnimatedNumber value={savings} prefix="$" />
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  ServiceTitan: $
                  {serviceTitan3Year.toLocaleString()} &middot; Custom build: $
                  {custom3Year.toLocaleString()}
                </p>
              </div>


            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
