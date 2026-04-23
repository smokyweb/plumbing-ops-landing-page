"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface StoryBlock {
  title: string;
  image: string;
  alt: string;
  body?: string;
  imageFirst?: boolean;
}

const blocks: StoryBlock[] = [
  {
    title: "Does This Look Like Your Plumbing Company?",
    image: "/1.png",
    alt: "Stressed plumbing company owner",
    imageFirst: true,
  },
  {
    title: "Are Your Customers Unhappy?",
    image: "/2.png",
    alt: "Stressed plumbing customer",
  },
  {
    title: "PlumbControl Changes Everything",
    image: "/3.png",
    alt: "Happy plumber with satisfied customer",
    body: "With PlumbControl, your staff is working efficiently and effectively. Our proven platform will organize your workflow, schedules and staff. This results in dramatically improved workflow and happy customers.",
  },
  {
    title: "Your Crew Will Also Be Well Organized With Their Schedules",
    image: "/4.png",
    alt: "Well-organized plumbing crew schedule",
    imageFirst: true,
  },
  {
    title: "Provide Easy-to-Follow Service Tasks Directly to Your Crew's Phone",
    image: "/main.png",
    alt: "Plumber receiving tasks on phone",
    body: "Service tasks are sent directly to your crew's phones and coordinated with the in-office team — keeping everyone on the same page, every job, every time.",
  },
];

export function StorySections() {
  return (
    <section className="px-6 py-8">
      <div className="mx-auto max-w-5xl space-y-24">
        {blocks.map((block, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className={`flex flex-col gap-10 lg:flex-row lg:items-center ${
              block.imageFirst ? "lg:flex-row-reverse" : ""
            }`}
          >
            {/* Image */}
            <div className="w-full lg:w-1/2">
              <Image
                src={block.image}
                alt={block.alt}
                width={600}
                height={400}
                className="w-full rounded-2xl object-cover shadow-2xl"
              />
            </div>

            {/* Text */}
            <div className="w-full lg:w-1/2">
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {block.title}
              </h2>
              {block.body && (
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                  {block.body}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Fleet photo at bottom */}
      <div className="mx-auto max-w-5xl mt-20">
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
      </div>
    </section>
  );
}
