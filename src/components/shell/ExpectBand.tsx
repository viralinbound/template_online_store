"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/** Giant type band — agency energy, ecommerce intent */
export function ExpectBand({ brand }: { brand: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  return (
    <section ref={ref} className="expect-band" aria-label="Brand statement">
      <motion.p className="expect-band-line" style={reduce ? undefined : { x: x1 }}>
        EXPECT THE EXTRA
      </motion.p>
      <motion.p className="expect-band-line invert" style={reduce ? undefined : { x: x2 }}>
        SHOP {brand.toUpperCase()} LIVE
      </motion.p>
    </section>
  );
}
