"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export type JourneyFloor = {
  label: string;
  title: string;
  categoryName: string;
  hero: string;
  storeCount?: number;
};

type Props = {
  floors: JourneyFloor[];
  onEnterFloor: (index: number) => void;
  brandName?: string;
};

/** Full-bleed scroll journey — each floor is a layout you enter */
export function MallFloorJourney({ floors, onEnterFloor, brandName = "Orva" }: Props) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const rootEl = root.current;
    if (!rootEl) return;
    const panels = [...rootEl.querySelectorAll<HTMLElement>("[data-floor-panel]")];
    const io = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!top) return;
        const idx = Number((top.target as HTMLElement).dataset.floorPanel);
        if (!Number.isNaN(idx)) setActive(idx);
      },
      { root: null, threshold: [0.35, 0.55, 0.7] },
    );
    panels.forEach((p) => io.observe(p));
    return () => io.disconnect();
  }, [floors.length]);

  const jump = (i: number) => {
    const el = root.current?.querySelector<HTMLElement>(`[data-floor-panel="${i}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="mall-journey" className="mall-journey" ref={root} aria-label="Mall floors">
      <div className="mall-journey-rail" aria-hidden>
        {floors.map((f, i) => (
          <button
            type="button"
            key={f.label}
            className={i === active ? "on" : ""}
            onClick={() => jump(i)}
            aria-label={`Floor ${f.label}`}
          >
            <span>{f.label}</span>
          </button>
        ))}
      </div>

      {  floors.map((floor, i) => (
        <FloorPanel
          key={floor.label}
          floor={floor}
          index={i}
          total={floors.length}
          brandName={brandName}
          onEnter={() => onEnterFloor(i)}
        />
      ))}
    </section>
  );
}

function FloorPanel({
  floor,
  index,
  total,
  brandName,
  onEnter,
}: {
  floor: JourneyFloor;
  index: number;
  total: number;
  brandName: string;
  onEnter: () => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["12%", "-12%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.35, 1, 1, 0.45]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.12, 1, 1.06]);

  return (
    <article
      ref={ref}
      className="mall-journey-panel"
      data-floor-panel={index}
      style={{ ["--fi" as string]: index }}
    >
      <motion.div className="mall-journey-media" style={{ opacity }}>
        <motion.img src={floor.hero} alt="" style={{ y, scale }} />
        <div className="mall-journey-veil" />
        <div className="mall-journey-scan" aria-hidden />
      </motion.div>

      <div className="mall-journey-copy">
        <p className="mall-journey-meta">
          {brandName} · Floor {floor.label}
          <em>
            {index + 1} / {total}
          </em>
        </p>
        <h2>{floor.title}</h2>
        <p>
          {floor.categoryName}
          {floor.storeCount != null ? ` · ${floor.storeCount} boutiques` : ""}
        </p>
        <div className="mall-journey-actions">
          <button type="button" className="primary" onClick={onEnter}>
            Enter floor {floor.label}
          </button>
          <span className="mall-journey-hint">Scroll for next level</span>
        </div>
      </div>
    </article>
  );
}
