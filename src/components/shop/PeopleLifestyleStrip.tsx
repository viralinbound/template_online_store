"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SectionHead } from "@/components/shell/SectionHead";
import { lifestylePeoplePool } from "@/lib/images";
import { revealTransition, revealUp } from "@/lib/motion";

/** Clean product cinema strip — paper frames, no awkward people shots */
export function PeopleLifestyleStrip({
  eyebrow = "Product cinema",
  title = "Pieces in focus",
}: {
  eyebrow?: string;
  title?: string;
}) {
  const reduce = useReducedMotion();
  const shots = lifestylePeoplePool().slice(0, 6);

  return (
    <section className="people-strip product-cinema orva-land-block">
      <SectionHead eyebrow={eyebrow} title={title} />
      <motion.div
        className="people-strip-rail"
        variants={revealUp}
        initial={reduce ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
        transition={revealTransition}
      >
        {shots.map((src, i) => (
          <motion.figure
            key={src}
            className="people-strip-card product-cinema-card"
            whileHover={reduce ? undefined : { y: -10, rotate: i % 2 === 0 ? -1.2 : 1.2 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" loading="lazy" />
            <figcaption>SKU {String(i + 1).padStart(2, "0")}</figcaption>
          </motion.figure>
        ))}
      </motion.div>
    </section>
  );
}
