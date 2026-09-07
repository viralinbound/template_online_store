"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { useEffect, useState } from "react";
import { useMallStore } from "@/store/useMallStore";

/** Sticky convert dock — shop / bag always one tap away after scroll */
export function OrderEaseDock() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const bagCount = useMallStore((s) => s.bagCount);
  const [hydrated, setHydrated] = useState(false);
  const [show, setShow] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => setHydrated(true), []);
  useMotionValueEvent(scrollY, "change", (v) => {
    setShow(v > 420);
  });

  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/checkout") ||
    pathname?.startsWith("/cart")
  ) {
    return null;
  }

  const count = hydrated ? bagCount() : 0;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="order-ease-dock"
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
        >
          <div className="order-ease-copy">
            <strong>Order in minutes</strong>
            <span>Mall · Shop · Bag · Checkout</span>
          </div>
          <div className="order-ease-actions">
            <Link href="/floors" className="order-ease-shop">
              Mall
            </Link>
            <Link href="/cart" className="order-ease-bag">
              Bag{count > 0 ? ` ${count}` : ""}
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
