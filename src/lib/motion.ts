import type { Transition, Variants } from "framer-motion";

/** Shared Orbit Desk motion language — one feel across the mall */
export const easeOut = [0.22, 1, 0.36, 1] as const;
export const easeSoft = [0.33, 1, 0.68, 1] as const;

export const duration = {
  fast: 0.22,
  base: 0.4,
  slow: 0.7,
  cinematic: 1.1,
  orbit: 0.55,
} as const;

export const springSoft = {
  type: "spring" as const,
  stiffness: 280,
  damping: 28,
};

export const springSnappy = {
  type: "spring" as const,
  stiffness: 380,
  damping: 30,
};

export const springOrbit = {
  type: "spring" as const,
  stiffness: 220,
  damping: 26,
};

export const pageEnter: Variants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export const pageEnterCalm: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const pageTransition: Transition = {
  duration: duration.base,
  ease: easeOut,
};

export const revealUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export const revealTransition: Transition = {
  duration: duration.slow,
  ease: easeOut,
};

export const staggerChildren = {
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

/** Routes that keep motion minimal (forms / ops) */
export function isCalmRoute(pathname: string | null | undefined) {
  if (!pathname) return false;
  return (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/cart") ||
    pathname.startsWith("/orders")
  );
}

export function doorLayoutId(storeId: string) {
  return `door-${storeId}`;
}

export function productLayoutId(productId: string) {
  return `sku-${productId}`;
}

/** Elliptical orbit position for index in a ring */
export function orbitPoint(
  index: number,
  total: number,
  rotation: number,
  rx = 220,
  ry = 90,
) {
  const angle = (index / Math.max(total, 1)) * Math.PI * 2 + rotation;
  return {
    x: Math.cos(angle) * rx,
    y: Math.sin(angle) * ry,
    z: Math.sin(angle), // depth cue −1..1
    angle,
  };
}
