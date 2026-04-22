"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const storyBlocks = [
  {
    img: "/plumbing-company-stressed.png",
    alt: "Stressed plumbing company",
    title: "Does This Look Like Your Plumbing Company?",
    text: "",
    imgFirst: true,
  },
  {
    img: "/plumbing-company-customer-stressed.png",
    alt: "Unhappy customers",
    title: "Are Your Customers Unhappy?",
    text: "",
    imgFirst: false,
  },
  {
    img: "/plumber-with-customer.png",
    alt: "Plumber with satisfied customer",
    title: "",
    text: "With PlumbControl, your staff is working efficiently and effectively. Our proven platform will organize your workflow, schedules and staff. This results in dramatically improved workflow and happy customers.",
    imgFirst: true,
  },
  {
    img: "/plumbing-crew-schedule.png",
    alt: "Plumbing crew schedule",
    title: "",
    text: "Your crew will also be well organized with their schedules.",
    imgFirst: false,
  },
  {
    img: "/plumber-phone-task.png",
    alt: "Plumber receiving task on phone",
    title: "",
    text: "Provide easy to follow service tasks to your crew sent directly to their phone and coordinated with the in-office team.",
    imgFirst: true,
  },
];

export function PlumbControlStory() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-5xl space-y-20">
        {storyBlocks.map((block, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className={`flex flex-col gap-10 md:flex-row md:items-center ${
              !block.imgFirst ? "md:flex-row-reverse" : ""
            }`}
          >
            <div className="flex-1">
              <Image
                src={block.img}
                alt={block.alt}
                width={600}
                height={400}
                className="w-full rounded-2xl object-cover shadow-lg"
              />
            </div>
            {(block.title || block.text) && (
              <div className="flex-1 space-y-4">
                {block.title && (
                  <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    {block.title}
                  </h3>
                )}
                {block.text && (
                  <p className="text-lg text-muted-foreground">{block.text}</p>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
