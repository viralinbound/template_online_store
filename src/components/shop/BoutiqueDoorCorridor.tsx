"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SectionHead } from "@/components/shell/SectionHead";
import { storeHref } from "@/lib/catalog";
import { doorLayoutId, duration, easeOut, springSoft } from "@/lib/motion";
import type { StoreNode } from "@/types/mall";

type Props = {
  stores: StoreNode[];
  /** full = deep 3D corridor; light = softer tilt for directory/food/home */
  variant?: "full" | "light";
  eyebrow?: string;
  title?: string;
  action?: React.ReactNode;
  /** When set, called instead of router navigation (e.g. home callbacks) */
  onEnterStore?: (store: StoreNode) => void;
};

/**
 * Cinematic boutique door corridor — scroll/drag doors in perspective,
 * Enter opens a brief door-open veil then navigates with shared layoutId.
 */
export function BoutiqueDoorCorridor({
  stores,
  variant = "full",
  eyebrow = "Boutiques",
  title = "Enter a door",
  action,
  onEnterStore,
}: Props) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [opening, setOpening] = useState<StoreNode | null>(null);

  if (!stores.length) return null;

  const light = variant === "light" || reduce;

  const scrollBy = (dir: -1 | 1) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".door-card");
    const w = card?.offsetWidth ?? 240;
    el.scrollBy({ left: dir * (w + 20), behavior: "smooth" });
  };

  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    const cards = [...el.querySelectorAll<HTMLElement>(".door-card")];
    const mid = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    cards.forEach((c, i) => {
      const center = c.offsetLeft + c.offsetWidth / 2;
      const d = Math.abs(center - mid);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setActive(best);
  };

  const enter = (store: StoreNode) => {
    if (opening) return;
    if (onEnterStore) {
      onEnterStore(store);
      return;
    }
    if (reduce) {
      router.push(storeHref(store));
      return;
    }
    setOpening(store);
    // Navigate immediately so layoutId can morph into store hero
    router.push(storeHref(store));
    window.setTimeout(() => setOpening(null), 600);
  };

  return (
    <section className={`door-corridor door-runway${light ? " light" : ""}${reduce ? " reduced" : ""}`}>
      <div className="door-corridor-head">
        <SectionHead eyebrow={eyebrow} title={title} action={action} />
        <div className="door-corridor-nav">
          <button type="button" onClick={() => scrollBy(-1)} aria-label="Previous door">
            ←
          </button>
          <button type="button" onClick={() => scrollBy(1)} aria-label="Next door">
            →
          </button>
        </div>
      </div>

      <div className="door-corridor-stage">
        {!light && <div className="door-corridor-glow" aria-hidden />}
        <div
          ref={scroller}
          className="door-corridor-rail"
          onScroll={onScroll}
        >
          {stores.map((s, i) => {
            const offset = i - active;
            const tilt = light ? Math.max(-10, Math.min(10, offset * -6)) : Math.max(-26, Math.min(26, offset * -12));
            const z = light ? (i === active ? 12 : 0) : i === active ? 56 : Math.max(-90, -Math.abs(offset) * 32);
            const scale = i === active ? 1.05 : Math.max(0.84, 1 - Math.abs(offset) * (light ? 0.04 : 0.07));
            const opacity = Math.max(0.4, 1 - Math.abs(offset) * (light ? 0.12 : 0.2));

            return (
              <motion.article
                key={s.id}
                className={`door-card${i === active ? " on" : ""}`}
                style={{
                  ["--a" as string]: s.theme.accent,
                  zIndex: 30 - Math.abs(offset),
                }}
                animate={
                  reduce
                    ? undefined
                    : {
                        rotateY: tilt,
                        z,
                        scale,
                        opacity,
                      }
                }
                transition={springSoft}
              >
                <button type="button" className="door-card-hit" onClick={() => enter(s)}>
                  <span className="door-card-media">
                    <motion.img
                      layoutId={doorLayoutId(s.id)}
                      src={s.doorImage}
                      alt=""
                      loading="lazy"
                      transition={{ duration: duration.slow, ease: easeOut }}
                    />
                    <em>Brand</em>
                  </span>
                  <span className="door-card-body">
                    <strong>{s.name}</strong>
                    <small>{s.subcategory}</small>
                  </span>
                </button>
                {i === active && (
                  <motion.button
                    type="button"
                    className="door-card-enter primary"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => enter(s)}
                  >
                    Enter
                  </motion.button>
                )}
              </motion.article>
            );
          })}
        </div>
        <p className="door-corridor-hint">
          Drag · scroll · open the active brand · {active + 1}/{stores.length}
        </p>
      </div>

      <AnimatePresence>
        {opening && (
          <motion.div
            className="door-open-veil"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            aria-hidden
          >
            <motion.div
              className="door-open-media"
              style={{ ["--a" as string]: opening.theme.accent }}
              initial={{ scale: 0.92, filter: "brightness(0.7)" }}
              animate={{ scale: 1.12, filter: "brightness(1.05)" }}
              transition={{ duration: 0.5, ease: easeOut }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={opening.doorImage} alt="" />
            </motion.div>
            <p>Entering {opening.name}…</p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
