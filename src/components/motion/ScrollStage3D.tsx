"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

function useSoftMobile() {
  const [soft, setSoft] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 720px)");
    const apply = () => setSoft(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return soft;
}

type StageProps = {
  children: ReactNode;
  className?: string;
  /** Progress bar only — no fog / heavy effects */
  lite?: boolean;
};

/** Full-page perspective stage + scroll progress rail */
export function ScrollStage3D({ children, className = "", lite = false }: StageProps) {
  const root = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: root,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 32, mass: 0.35 });
  const fogA = useTransform(scrollYProgress, [0, 0.35, 1], [0.55, 0.25, 0.4]);
  const fogB = useTransform(scrollYProgress, [0, 0.5, 1], [0.2, 0.45, 0.15]);

  return (
    <div ref={root} className={`scroll-stage-3d${lite ? " lite" : ""} ${className}`.trim()}>
      {!reduce && (
        <>
          <motion.div className="scroll-stage-progress" style={{ scaleX: progress }} aria-hidden />
          {!lite && (
            <div className="scroll-stage-depth" aria-hidden>
              <motion.span style={{ opacity: fogA }} />
              <motion.span style={{ opacity: fogB }} />
            </div>
          )}
        </>
      )}
      <div className="scroll-stage-space">{children}</div>
    </div>
  );
}

type SectionProps = {
  children: ReactNode;
  className?: string;
  /** Stronger tumble for hero-scale blocks */
  intensity?: "soft" | "bold";
  /** Skip 3D transforms — use for dense interactive sections */
  lite?: boolean;
};

/** Section that tilts and advances in Z as it crosses the viewport */
export function ScrollSection3D({
  children,
  className = "",
  intensity = "soft",
  lite = false,
}: SectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const softMobile = useSoftMobile();
  const factorRef = useRef(1);
  factorRef.current = softMobile ? 0.45 : 1;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const baseTilt = intensity === "bold" ? 9 : 5.5;
  const baseZ = intensity === "bold" ? 80 : 42;
  const baseY = intensity === "bold" ? 56 : 32;

  const rotateX = useTransform(scrollYProgress, (v) => {
    const f = factorRef.current;
    const max = baseTilt * f;
    if (v <= 0.45) return max * (1 - v / 0.45);
    return -max * 0.65 * ((v - 0.45) / 0.55);
  });
  const y = useTransform(scrollYProgress, (v) => {
    const f = factorRef.current;
    const max = baseY * f;
    if (v <= 0.5) return max * (1 - v / 0.5);
    return -max * 0.4 * ((v - 0.5) / 0.5);
  });
  const z = useTransform(scrollYProgress, (v) => {
    const f = factorRef.current;
    const max = baseZ * f;
    if (v <= 0.45) return -max + max * (v / 0.45);
    return max * 0.35 * ((v - 0.45) / 0.55);
  });
  const scale = useTransform(scrollYProgress, [0, 0.4, 0.85, 1], [0.94, 1, 1, 0.985]);
  const opacity = useTransform(scrollYProgress, [0, 0.18, 0.82, 1], [0.35, 1, 1, 0.55]);

  if (reduce || lite) {
    return (
      <div ref={ref} className={`scroll-section-3d ${className}`.trim()}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={`scroll-section-3d ${className}`.trim()}>
      <motion.div
        className="scroll-section-3d-inner"
        style={{
          rotateX,
          y,
          z,
          scale,
          opacity,
          transformPerspective: 1400,
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  speed?: number;
};

/** Lightweight parallax layer for media inside a 3D section */
export function ScrollParallax3D({ children, className = "", speed = 40 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);

  if (reduce) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  );
}
