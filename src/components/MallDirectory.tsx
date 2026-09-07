"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useCatalog } from "@/components/CatalogProvider";
import type { StoreNode } from "@/types/mall";

type Props = {
  accent: string;
  onOpenFloor: (floorIndex: number) => void;
  onOpenStore: (store: StoreNode, floorIndex: number) => void;
  onShop: () => void;
  onBack?: () => void;
};

export function MallDirectory({ accent, onOpenFloor, onOpenStore, onShop, onBack }: Props) {
  const { floors, config } = useCatalog();
  const [q, setQ] = useState("");
  const [openFloor, setOpenFloor] = useState<string | "all">("all");

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    return floors
      .map((f, floorIndex) => {
        const stores = f.stores.filter((s) => {
          if (!query) return true;
          return (
            s.name.toLowerCase().includes(query) ||
            s.subcategory.toLowerCase().includes(query) ||
            s.category.toLowerCase().includes(query) ||
            f.title.toLowerCase().includes(query)
          );
        });
        return { floor: f, floorIndex, stores };
      })
      .filter((r) => r.stores.length > 0 || !query);
  }, [q, floors]);

  return (
    <motion.section
      className="dir-page"
      style={{ ["--a" as string]: accent }}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <header className="dir-head">
        <div>
          <p className="dest-kicker">Mall map</p>
          <h2>Directory</h2>
          <p>
            Every floor and boutique in one place — the fastest way to understand {config.brandName}.
          </p>
        </div>
        <div className="dir-head-actions">
          {onBack && (
            <button type="button" onClick={onBack}>
              ← Back
            </button>
          )}
          <button type="button" className="primary" onClick={onShop}>
            Shop now
          </button>
        </div>
      </header>

      <label className="dir-search">
        Find a boutique
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search stores, floors, categories…"
        />
      </label>

      <div className="dir-floor-pills">
        <button
          type="button"
          className={openFloor === "all" ? "on" : ""}
          onClick={() => setOpenFloor("all")}
        >
          All floors
        </button>
        {floors.map((f) => (
          <button
            type="button"
            key={f.label}
            className={openFloor === f.label ? "on" : ""}
            onClick={() => setOpenFloor(f.label)}
          >
            Floor {f.label}
          </button>
        ))}
      </div>

      <div className="dir-list">
        {rows
          .filter((r) => openFloor === "all" || r.floor.label === openFloor)
          .map(({ floor, floorIndex, stores }) => (
            <article key={floor.id} className="dir-floor">
              <header>
                <div>
                  <em>Floor {floor.label}</em>
                  <h3>{floor.title}</h3>
                  <p>{floor.categoryName}</p>
                </div>
                <button type="button" onClick={() => onOpenFloor(floorIndex)}>
                  Open floor
                </button>
              </header>
              <div className="dir-stores">
                {stores.map((s) => (
                  <button
                    type="button"
                    key={s.id}
                    className="dir-store"
                    onClick={() => onOpenStore(s, floorIndex)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.doorImage} alt="" />
                    <span>
                      <strong>{s.name}</strong>
                      <small>{s.subcategory}</small>
                    </span>
                  </button>
                ))}
                {stores.length === 0 && <p className="muted">No boutiques match this search.</p>}
              </div>
            </article>
          ))}
      </div>
    </motion.section>
  );
}
