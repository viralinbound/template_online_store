"use client";

import { motion, useReducedMotion } from "framer-motion";
import { revealTransition, revealUp } from "@/lib/motion";

/** Soft marquee strip — shared atmosphere across site */
export function AtmosphereBand({ items }: { items: string[] }) {
  const reduce = useReducedMotion();
  if (!items.length) return null;
  const loop = [...items, ...items];
  return (
    <motion.div
      className="orva-land-marquee"
      aria-hidden
      variants={revealUp}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-20px" }}
      transition={revealTransition}
    >
      <div className={`orva-land-marquee-track${reduce ? " reduced" : ""}`}>
        {loop.map((t, i) => (
          <span key={`${t}-${i}`}>{t}</span>
        ))}
      </div>
    </motion.div>
  );
}
