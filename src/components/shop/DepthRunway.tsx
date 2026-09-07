"use client";

import { motion, useReducedMotion } from "framer-motion";
import { LANDING_CHIPS } from "@/lib/catalog";

type Props = {
  onShop: (category?: string) => void;
  onFood?: () => void;
};

/** Unique 2.5D category runway — perspective cards that tilt toward the shopper */
export function DepthRunway({ onShop, onFood }: Props) {
  const reduce = useReducedMotion();
  const items = [
    ...LANDING_CHIPS.map((c) => ({ label: c.label, category: c.category, tone: "shop" as const })),
    { label: "Café & food", category: "food", tone: "food" as const },
  ];

  return (
    <section className="depth-runway" aria-label="Shop by world">
      <div className="depth-runway-head">
        <p>Enter a world</p>
        <h2>2.5D catalog lanes</h2>
      </div>
      <div className="depth-runway-stage">
        {items.map((item, i) => {
          const mid = (items.length - 1) / 2;
          const offset = i - mid;
          return (
            <motion.button
              type="button"
              key={item.label}
              className={`depth-runway-card tone-${item.tone}`}
              style={{
                ["--tilt" as string]: `${offset * -7}deg`,
                ["--z" as string]: `${Math.round(40 - Math.abs(offset) * 12)}px`,
              }}
              initial={reduce ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ delay: i * 0.04, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              whileHover={
                reduce
                  ? undefined
                  : { y: -6, scale: 1.03, transition: { type: "spring", stiffness: 360, damping: 24 } }
              }
              onClick={() =>
                item.category === "food" && onFood ? onFood() : onShop(item.category)
              }
            >
              <em>{String(i + 1).padStart(2, "0")}</em>
              <strong>{item.label}</strong>
              <span>Open lane →</span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
