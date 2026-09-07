"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AmbientField } from "@/components/shell/AmbientField";
import { CINEMATIC_HERO_SLIDES } from "@/lib/images";
import { duration, easeOut } from "@/lib/motion";

type Props = {
  brand: string;
  tagline?: string;
  lead?: string;
  actions?: ReactNode;
  chips?: ReactNode;
  onScrollCue?: () => void;
};

/** Illoca-inspired cinematic hero — paper headline + product stage (no weird people shots) */
export function CinematicHero({
  brand,
  tagline,
  lead,
  actions,
  chips,
  onScrollCue,
}: Props) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const slides = CINEMATIC_HERO_SLIDES;
  const slide = slides[i]!;

  useEffect(() => {
    if (reduce) return;
    const t = window.setInterval(() => setI((v) => (v + 1) % slides.length), 4800);
    return () => window.clearInterval(t);
  }, [reduce, slides.length]);

  return (
    <section className="cine-hero cine-hero-illoca">
      <AmbientField variant="hero" />

      <div className="cine-hero-headband">
        <motion.p
          className="cine-sketch"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
        >
          curated floors
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06, duration: 0.75, ease: easeOut }}
        >
          Shop at the speed of desire
        </motion.h1>
        <motion.p
          className="cine-sketch cine-sketch-right"
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.12 }}
        >
          not clutter
        </motion.p>
        {tagline && <p className="orva-land-kicker">{tagline}</p>}
        <p className="orva-land-lead">
          {lead ?? `${brand} — browse, enter floors, quick-look products, checkout.`}
        </p>
        {actions}
        {chips}
      </div>

      <div className="cine-hero-stage">
        <AnimatePresence mode="sync">
          <motion.img
            key={slide.image}
            className="cine-hero-img"
            src={slide.image}
            alt=""
            initial={reduce ? false : { opacity: 0, scale: 1.08, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: duration.cinematic, ease: easeOut }}
          />
        </AnimatePresence>
        <div className="cine-hero-stage-veil" />
        <div className="cine-hero-stage-copy">
          <em>{slide.label}</em>
          <strong>{slide.caption}</strong>
        </div>
        <div className="cine-hero-dots" aria-hidden>
          {slides.map((s, idx) => (
            <button
              key={s.image}
              type="button"
              className={idx === i ? "on" : ""}
              onClick={() => setI(idx)}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {onScrollCue && (
        <button type="button" className="orva-land-scrollcue cine-scroll" onClick={onScrollCue}>
          <span>Scroll the mall workflow</span>
          <i />
        </button>
      )}
    </section>
  );
}
