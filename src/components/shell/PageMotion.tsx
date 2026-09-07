"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  duration,
  easeOut,
  isCalmRoute,
  pageEnter,
  pageEnterCalm,
} from "@/lib/motion";

/** Route-keyed page enter — cinematic 2.5D on browse, calm on checkout */
export function PageMotion({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const calm = isCalmRoute(pathname) || reduce;

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={pathname ?? "page"}
        className="page-motion studio-page"
        variants={calm ? pageEnterCalm : pageEnter}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={
          calm
            ? { duration: 0.12 }
            : { duration: Math.min(duration.base * 0.7, 0.32), ease: easeOut }
        }
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
