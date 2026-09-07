"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useCatalog } from "@/components/CatalogProvider";
import { useMallStore } from "@/store/useMallStore";

export function AdminInsightsPage() {
  const { floors, products } = useCatalog();
  const bag = useMallStore((s) => s.bag);
  const wishlist = useMallStore((s) => s.wishlist);
  const recent = useMallStore((s) => s.recent);
  const compare = useMallStore((s) => s.compare);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const byCat = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach((p) => map.set(p.category, (map.get(p.category) ?? 0) + 1));
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [products]);

  return (
    <AdminShell title="Insights" lead="Pulse of catalog depth and shopper signals on this device.">
      <div className="admin-stats">
        <article>
          <em>Catalog SKUs</em>
          <strong>{products.length}</strong>
        </article>
        <article>
          <em>Floors</em>
          <strong>{floors.length}</strong>
        </article>
        <article>
          <em>Bag lines</em>
          <strong>{hydrated ? bag.length : "—"}</strong>
        </article>
        <article>
          <em>Wishlist</em>
          <strong>{hydrated ? wishlist.length : "—"}</strong>
        </article>
      </div>

      <section className="admin-panel">
        <h3>By category</h3>
        <ul className="admin-bars">
          {byCat.map(([cat, n]) => (
            <li key={cat}>
              <span>{cat}</span>
              <i style={{ width: `${Math.min(100, (n / products.length) * 100)}%` }} />
              <em>{n}</em>
            </li>
          ))}
        </ul>
      </section>

      <section className="admin-panel" style={{ marginTop: "1rem" }}>
        <h3>Recent views (device)</h3>
        <p className="muted">
          {hydrated && recent.length
            ? recent
                .slice(0, 6)
                .map((p) => p.name)
                .join(" · ")
            : "No recent products yet."}
        </p>
        <p className="muted">Compare tray: {hydrated ? compare.length : 0} / 3</p>
      </section>
    </AdminShell>
  );
}
