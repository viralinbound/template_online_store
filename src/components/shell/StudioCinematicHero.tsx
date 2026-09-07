"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { Magnetic, MotionCTA } from "@/components/motion/MotionKit";
import { CINEMATIC_HERO_SLIDES } from "@/lib/images";
import { duration, easeOut } from "@/lib/motion";

type Props = {
  brand: string;
  tagline?: string;
  lead?: string;
  heroProductImage?: string;
  actions?: ReactNode;
  chips?: ReactNode;
  onScrollCue?: () => void;
  onMall?: () => void;
  onShop?: () => void;
  onFood?: () => void;
};

type Pin = {
  id: string;
  label: string;
  title: string;
  body: string;
  cta: string;
  x: string;
  y: string;
  run: "shop" | "mall" | "food";
};

const PINS: Pin[] = [
  {
    id: "edit",
    label: "Edit",
    title: "Curated catalog",
    body: "Browse by world, open a quick look, buy in two taps.",
    cta: "Start shopping",
    x: "18%",
    y: "42%",
    run: "shop",
  },
  {
    id: "mall",
    label: "Mall",
    title: "Walk the floors",
    body: "Atrium → category → boutique → product — still real checkout.",
    cta: "Enter mall",
    x: "78%",
    y: "34%",
    run: "mall",
  },
  {
    id: "food",
    label: "Food",
    title: "Café court",
    body: "Coffee and sweets on the same bag as fashion and tech.",
    cta: "Shop food",
    x: "72%",
    y: "72%",
    run: "food",
  },
];

/** Moshi-grade cinematic open — lag-light: CSS float, fewer stars, no blur filters */
export function StudioCinematicHero({
  brand,
  tagline,
  lead,
  heroProductImage,
  actions,
  chips,
  onScrollCue,
  onMall,
  onShop,
  onFood,
}: Props) {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const rafRef = useRef(0);
  const slides = CINEMATIC_HERO_SLIDES;
  const [i, setI] = useState(0);
  const [pin, setPin] = useState<string | null>(null);
  const [ready, setReady] = useState(!!reduce);
  const [inView, setInView] = useState(true);
  const slide = slides[i]!;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 90, damping: 22 });
  const sy = useSpring(my, { stiffness: 90, damping: 22 });
  const floatX = useTransform(sx, [-0.5, 0.5], ["-2%", "2%"]);
  const floatY = useTransform(sy, [-0.5, 0.5], ["1.5%", "-1.5%"]);

  const productSrc = heroProductImage || slide.image;
  const stars = useMemo(
    () =>
      Array.from({ length: reduce ? 0 : 16 }, (_, n) => ({
        id: n,
        left: `${(n * 37) % 100}%`,
        top: `${(n * 53) % 100}%`,
        size: 1 + (n % 2),
        delay: (n % 8) * 0.4,
        dur: 4 + (n % 4),
      })),
    [reduce],
  );

  useEffect(() => {
    if (reduce) return;
    const t = window.setTimeout(() => setReady(true), 280);
    return () => window.clearTimeout(t);
  }, [reduce]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setInView(!!e?.isIntersecting), {
      threshold: 0.12,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduce || pin || !inView) return;
    const t = window.setInterval(() => setI((v) => (v + 1) % slides.length), 6400);
    return () => window.clearInterval(t);
  }, [reduce, pin, slides.length, inView]);

  const runPin = (p: Pin) => {
    if (p.run === "shop") onShop?.();
    if (p.run === "mall") onMall?.();
    if (p.run === "food") onFood?.();
  };

  return (
    <section
      ref={rootRef}
      className={`studio-cine${ready ? " is-ready" : ""}${reduce ? " is-static" : ""}`}
      aria-label="Opening"
      onMouseMove={(e) => {
        if (reduce || !rootRef.current || !inView) return;
        const r = rootRef.current.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
          mx.set(nx);
          my.set(ny);
        });
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      <div className="studio-cine-space" aria-hidden>
        <div className="studio-cine-nebula" />
        {stars.map((s) => (
          <span
            key={s.id}
            className="studio-cine-star"
            style={{
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.dur}s`,
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="sync">
        <motion.div
          key={slide.image}
          className="studio-cine-plate"
          style={reduce ? undefined : { x: floatX, y: floatY }}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: easeOut }}
        >
          <img src={slide.image} alt="" className="studio-cine-plate-img" loading="eager" decoding="async" />
        </motion.div>
      </AnimatePresence>

      <div className="studio-cine-veil" aria-hidden />

      <div className={`studio-cine-orbit${inView && !reduce ? " is-float" : ""}`}>
        <div className="studio-cine-orbit-glow" aria-hidden />
        <AnimatePresence mode="wait">
          <motion.img
            key={productSrc}
            src={productSrc}
            alt=""
            className="studio-cine-product"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: easeOut }}
            draggable={false}
          />
        </AnimatePresence>
        <span className="studio-cine-orbit-ring" aria-hidden />
        <span className="studio-cine-orbit-ring delay" aria-hidden />
      </div>

      <div className="studio-cine-copy">
        <motion.p
          className="studio-cine-kicker"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ delay: 0.06, duration: duration.base }}
        >
          {slide.label} · live commerce
        </motion.p>
        <motion.h1
          className="studio-cine-brand"
          initial={reduce ? false : { opacity: 0, y: 28 }}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ delay: 0.12, duration: 0.7, ease: easeOut }}
        >
          {brand}
        </motion.h1>
        <motion.p
          className="studio-cine-headline"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ delay: 0.2, duration: 0.65, ease: easeOut }}
        >
          Shop at the speed of desire
        </motion.p>
        {tagline && <p className="studio-cine-tag">{tagline}</p>}
        <p className="studio-cine-lead">
          {lead ?? "Immersive browse, quick look, bag, and checkout — built to stop the scroll."}
        </p>
        <p className="studio-cine-hint">Tap the glowing pins to explore</p>
        {actions}
        {chips}
      </div>

      {!reduce &&
        PINS.map((p) => (
          <div key={p.id} className="studio-cine-pin" style={{ left: p.x, top: p.y }}>
            <button
              type="button"
              className={pin === p.id ? "on" : ""}
              aria-expanded={pin === p.id}
              aria-label={p.label}
              onClick={() => setPin((v) => (v === p.id ? null : p.id))}
            >
              <i />
            </button>
            <AnimatePresence>
              {pin === p.id && (
                <motion.div
                  className="studio-cine-pop"
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ type: "spring", stiffness: 420, damping: 28 }}
                >
                  <em>{p.label}</em>
                  <strong>{p.title}</strong>
                  <p>{p.body}</p>
                  <Magnetic>
                    <MotionCTA>
                      <button type="button" className="primary" onClick={() => runPin(p)}>
                        {p.cta}
                      </button>
                    </MotionCTA>
                  </Magnetic>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

      <div className="studio-cine-rail" aria-hidden>
        {slides.map((s, idx) => (
          <button
            key={s.image}
            type="button"
            className={idx === i ? "on" : ""}
            onClick={() => setI(idx)}
            aria-label={`Scene ${idx + 1}`}
          />
        ))}
      </div>

      {onScrollCue && (
        <button type="button" className="studio-cine-scroll" onClick={onScrollCue}>
          <span />
          Scroll the edit
        </button>
      )}
    </section>
  );
}
