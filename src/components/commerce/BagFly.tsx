"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useMallStore } from "@/store/useMallStore";

/** Mini image flies toward bag when item added */
export function BagFly() {
  const toast = useMallStore((s) => s.cartToast);
  const [fly, setFly] = useState<{ image: string; id: number } | null>(null);

  useEffect(() => {
    if (!toast?.image) return;
    const id = Date.now();
    setFly({ image: toast.image, id });
    const t = window.setTimeout(() => setFly(null), 700);
    return () => window.clearTimeout(t);
  }, [toast]);

  return (
    <AnimatePresence>
      {fly && (
        <motion.div
          key={fly.id}
          className="bag-fly"
          initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          animate={{ opacity: 0.2, scale: 0.25, x: "38vw", y: "-42vh" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={fly.image} alt="" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
