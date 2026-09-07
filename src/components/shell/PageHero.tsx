"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

type Props = {
  kicker: string;
  title: string;
  lead?: string;
  image: string;
  /** compact = inner pages; tall = near-home energy */
  size?: "compact" | "tall";
  children?: ReactNode;
  actions?: ReactNode;
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
}: Props) {
  return (
    <section className={`orva-page-hero ${size}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <motion.img
        className="orva-page-hero-img"
        src={image}
        alt=""
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
      />
      <div className="orva-page-hero-veil" />
      <div className="orva-page-hero-grain" aria-hidden />
      <div className="orva-page-hero-copy">
        <p className="orva-land-kicker">{kicker}</p>
        <h1>{title}</h1>
        {lead && <p className="orva-page-hero-lead">{lead}</p>}
        {actions && <div className="orva-land-cta">{actions}</div>}
        {children}
      </div>
    </section>
  );
}
