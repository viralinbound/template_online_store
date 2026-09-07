"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CINEMATIC_HERO_SLIDES } from "@/lib/images";
import { duration, easeOut } from "@/lib/motion";

type Props = {
  brand: string;
  tagline?: string;
  lead?: string;
  actions?: ReactNode;
  chips?: ReactNode;
  onScrollCue?: () => void;
  onMall?: () => void;
  onShop?: () => void;
  onFood?: () => void;
  onBrands?: () => void;
  panelImages?: string[];
};

type Hotspot = {
  id: string;
  label: string;
  title: string;
  body: string;
  cta: string;
  x: string;
  y: string;
  action: "mall" | "shop" | "food" | "brands";
};

const HOTSPOTS: Hotspot[] = [
  {
    id: "mall",
    label: "Mall",
    title: "Walk the atrium",
    body: "Floors → category → shops → products. Enter a level and buy.",
    cta: "Open mall",
    x: "74%",
    y: "38%",
    action: "mall",
  },
  {
    id: "look",
    label: "Look",
    title: "Quick look 2.5D",
    body: "Tap any piece for color, tilt preview, and add to bag.",
    cta: "Start shopping",
    x: "28%",
    y: "52%",
    action: "shop",
  },
  {
    id: "food",
    label: "Food",
    title: "Café court",
    body: "Coffee, bites, sweets — same checkout path as the rest of Orva.",
    cta: "Shop food",
    x: "58%",
    y: "68%",
    action: "food",
  },
];

/**
 * Animated cinematic hero — moving banner, click hotspots, slide morph.
 */
export function EcommerceOpenHero({
  brand,
  tagline,
  lead,
  actions,
  chips,
  onScrollCue,
  onMall,
  onShop,
  onFood,
  onBrands,
  panelImages,
}: Props) {
  const reduce = useReducedMotion();
  const slides = CINEMATIC_HERO_SLIDES;
  const panels =
    panelImages?.slice(0, 3) ??
    ([slides[0]?.image, slides[1]?.image, slides[2]?.image].filter(Boolean) as string[]);

  const [phase, setPhase] = useState<"panels" | "open">(reduce ? "open" : "panels");
  const [i, setI] = useState(0);
  const [activeHot, setActiveHot] = useState<string | null>(null);
  const slide = slides[i]!;

  useEffect(() => {
    if (reduce) return;
    const t = window.setTimeout(() => setPhase("open"), 1500);
    return () => window.clearTimeout(t);
  }, [reduce]);

  useEffect(() => {
    if (reduce || phase !== "open" || activeHot) return;
    const t = window.setInterval(() => setI((v) => (v + 1) % slides.length), 5200);
    return () => window.clearInterval(t);
  }, [reduce, phase, slides.length, activeHot]);

  const runHot = (h: Hotspot) => {
    if (h.action === "mall") onMall?.();
    if (h.action === "shop") onShop?.();
    if (h.action === "food") onFood?.();
    if (h.action === "brands") onBrands?.();
  };

  return (
    <section className={`ecom-open${phase === "open" ? " is-open" : ""}`} aria-label="Opening">
      <AnimatePresence mode="wait">
        {phase === "panels" && (
          <motion.div
            key="panels"
            className="ecom-open-panels"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: duration.base, ease: easeOut }}
          >
            {panels.map((src, idx) => (
              <motion.div
                key={src}
                className="ecom-open-panel"
                initial={{ opacity: 0, y: 40, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.12 + idx * 0.12, duration: duration.slow, ease: easeOut }}
              >
                <img src={src} alt="" />
                {idx === 1 && (
                  <motion.span
                    className="ecom-open-brand"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55, duration: duration.slow }}
                  >
                    {brand}
                  </motion.span>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="ecom-open-stage"
        initial={false}
        animate={
          phase === "open"
            ? { opacity: 1, scale: 1 }
            : { opacity: 0, scale: 1.04, pointerEvents: "none" as const }
        }
        transition={{ duration: duration.cinematic, ease: easeOut }}
      >
        <div className="ecom-open-bg-wrap">
          <AnimatePresence mode="sync">
            <motion.img
              key={slide.image}
              className="ecom-open-bg ecom-open-bg-move"
              src={slide.image}
              alt=""
              initial={reduce ? false : { opacity: 0, scale: 1.12, x: 24 }}
              animate={
                reduce
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 1, scale: 1.18, x: [-12, 18, -8], y: [0, -10, 4] }
              }
              exit={{ opacity: 0 }}
              transition={
                reduce
                  ? { duration: 0.4 }
                  : {
                      opacity: { duration: 0.9, ease: easeOut },
                      scale: { duration: 0.9, ease: easeOut },
                      x: { duration: 14, repeat: Infinity, ease: "easeInOut" },
                      y: { duration: 11, repeat: Infinity, ease: "easeInOut" },
                    }
              }
            />
          </AnimatePresence>
        </div>
        <div className="ecom-open-veil" aria-hidden />
        <div className="ecom-open-shine" aria-hidden />

        <div className="ecom-open-copy">
          <motion.p
            className="ecom-open-kicker"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={phase === "open" ? { opacity: 1, y: 0 } : undefined}
            transition={{ delay: 0.05 }}
          >
            {slide.label} · curated edit
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 28 }}
            animate={phase === "open" ? { opacity: 1, y: 0 } : undefined}
            transition={{ delay: 0.12, duration: 0.8, ease: easeOut }}
          >
            Shop at the speed of desire
          </motion.h1>
          {tagline && <p className="ecom-open-tag">{tagline}</p>}
          <p className="ecom-open-lead">
            {lead ?? `${brand} — browse, enter floors, quick-look products, checkout.`}
          </p>
          <p className="ecom-open-hint">Click the glowing pins to explore</p>
          {phase === "open" && actions}
          {phase === "open" && chips}
        </div>

        {phase === "open" &&
          !reduce &&
          HOTSPOTS.map((h) => (
            <div key={h.id} className="ecom-hot" style={{ left: h.x, top: h.y }}>
              <button
                type="button"
                className={`ecom-hot-pin${activeHot === h.id ? " on" : ""}`}
                aria-expanded={activeHot === h.id}
                aria-label={h.label}
                onClick={() => setActiveHot((v) => (v === h.id ? null : h.id))}
              >
                <span />
              </button>
              <AnimatePresence>
                {activeHot === h.id && (
                  <motion.div
                    className="ecom-hot-card"
                    initial={{ opacity: 0, y: 12, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 380, damping: 26 }}
                  >
                    <em>{h.label}</em>
                    <strong>{h.title}</strong>
                    <p>{h.body}</p>
                    <button type="button" className="primary" onClick={() => runHot(h)}>
                      {h.cta}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

        {onScrollCue && (
          <button type="button" className="ecom-open-scroll" onClick={onScrollCue}>
            Scroll to shop
          </button>
        )}

        <div className="ecom-open-dots" aria-hidden>
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
      </motion.div>
    </section>
  );
}
