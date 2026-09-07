"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Magnetic, MotionCTA } from "@/components/motion/MotionKit";
import { easeOut } from "@/lib/motion";

export type SpotlightSlide = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  cta: string;
  onCta: () => void;
};

/** Full-bleed campaign reel — Moshi-style storytelling for ecommerce worlds */
export function SpotlightReel({ slides }: { slides: SpotlightSlide[] }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const slide = slides[i];

  useEffect(() => {
    if (reduce || slides.length < 2) return;
    const t = window.setInterval(() => setI((v) => (v + 1) % slides.length), 5200);
    return () => window.clearInterval(t);
  }, [reduce, slides.length]);

  if (!slide) return null;

  return (
    <section className="spot-reel" aria-label="Featured campaigns">
      <div className="spot-reel-head">
        <p>Featured worlds</p>
        <h2>
          Expect
          <br />
          <em>the edit</em>
        </h2>
      </div>

      <div className="spot-reel-stage">
        <AnimatePresence mode="wait">
          <motion.article
            key={slide.id}
            className="spot-reel-frame"
            initial={reduce ? false : { opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.85, ease: easeOut }}
          >
            <motion.img
              src={slide.image}
              alt=""
              initial={reduce ? false : { opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.85, ease: easeOut }}
            />
            <div className="spot-reel-veil" />
            <div className="spot-reel-copy">
              <p>{slide.eyebrow}</p>
              <h3>{slide.title}</h3>
              <p className="spot-reel-body">{slide.body}</p>
              <Magnetic>
                <MotionCTA pulse>
                  <button type="button" className="primary" onClick={slide.onCta}>
                    {slide.cta}
                  </button>
                </MotionCTA>
              </Magnetic>
            </div>
          </motion.article>
        </AnimatePresence>

        <div className="spot-reel-tabs" role="tablist" aria-label="Campaigns">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={idx === i}
              className={idx === i ? "on" : ""}
              onClick={() => setI(idx)}
            >
              <span>{String(idx + 1).padStart(2, "0")}</span>
              {s.eyebrow}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
