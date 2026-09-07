"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";

const STEPS = [
  { id: "shop", href: "/shop", label: "Shop" },
  { id: "look", href: "/#orbit-stage", label: "Look" },
  { id: "bag", href: "/cart", label: "Bag" },
  { id: "checkout", href: "/checkout", label: "Checkout" },
] as const;

function stepActive(id: string, pathname: string | null) {
  if (!pathname) return false;
  if (id === "shop")
    return (
      pathname.startsWith("/shop") ||
      pathname.startsWith("/search") ||
      pathname.startsWith("/food") ||
      pathname.startsWith("/directory")
    );
  if (id === "look") return pathname === "/" || pathname.startsWith("/product");
  if (id === "bag") return pathname.startsWith("/cart");
  if (id === "checkout") return pathname.startsWith("/checkout");
  return false;
}

/** Sticky workflow ribbon — Shop · Look · Bag · Checkout */
export function WorkflowRibbon() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/help") ||
    pathname?.startsWith("/orders")
  ) {
    return null;
  }

  return (
    <motion.nav
      className="workflow-ribbon"
      aria-label="Shopping workflow"
      initial={reduce ? false : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {STEPS.map((s, i) => (
        <motion.div
          key={s.id}
          initial={reduce ? false : { opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 + i * 0.05 }}
          whileHover={reduce ? undefined : { y: -2 }}
        >
          <Link href={s.href} className={stepActive(s.id, pathname) ? "on" : ""}>
            <em>{String(i + 1).padStart(2, "0")}</em>
            {s.label}
          </Link>
        </motion.div>
      ))}
    </motion.nav>
  );
}
