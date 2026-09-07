"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { TextReveal } from "@/components/motion/MotionKit";
import { revealTransition, revealUp } from "@/lib/motion";

type Props = {
  eyebrow: string;
  title: string;
  action?: ReactNode;
  className?: string;
};

export function SectionHead({ eyebrow, title, action, className = "" }: Props) {
  const reduce = useReducedMotion();

  return (
    <motion.header
      className={`orva-land-head ${className}`.trim()}
      variants={revealUp}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      transition={revealTransition}
    >
      <div>
        <motion.p
          className="orva-land-eyebrow"
          initial={reduce ? false : { opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          {eyebrow}
        </motion.p>
        {reduce ? <h2>{title}</h2> : <TextReveal text={title} />}
      </div>
      {action}
    </motion.header>
  );
}
