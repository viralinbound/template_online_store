"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { duration, easeOut } from "@/lib/motion";

type Props = {
  kicker: string;
  title: string;
  lead?: string;
  image: string;
  /** compact = inner pages; tall = near-home energy */
  size?: "compact" | "tall";
  children?: ReactNode;
  actions?: ReactNode;
  /** Shared morph from BoutiqueDoorCorridor */
  layoutId?: string;
};

/** Cinematic page hero — same DNA as explore landing */
export function PageHero({
  kicker,
  title,
  lead,
  image,
  size = "compact",
  children,
  actions,
  layoutId,
}: Props) {
  const reduce = useReducedMotion();

  return (
    <section className={`orva-page-hero ${size}`}>
      <motion.img
        className="orva-page-hero-img"
        src={image}
        alt=""
        layoutId={layoutId}
        initial={reduce || layoutId ? false : { scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: duration.cinematic, ease: easeOut }}
      />
      <div className="orva-page-hero-veil" />
      <div className="orva-page-hero-grain" aria-hidden />
      <motion.div
        className="orva-page-hero-copy"
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.slow, ease: easeOut, delay: 0.08 }}
      >
        <p className="orva-land-kicker">{kicker}</p>
        <h1>{title}</h1>
        {lead && <p className="orva-page-hero-lead">{lead}</p>}
        {actions && <div className="orva-land-cta">{actions}</div>}
        {children}
      </motion.div>
    </section>
  );
}
