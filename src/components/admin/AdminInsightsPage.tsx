"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useCatalog } from "@/components/CatalogProvider";
import { useMallStore } from "@/store/useMallStore";

export function AdminInsightsPage() {
  const { floors, products, refresh } = useCatalog();
  const bag = useMallStore((s) => s.bag);
  const wishlist = useMallStore((s) => s.wishlist);
  const recent = useMallStore((s) => s.recent);
  const compare = useMallStore((s) => s.compare);
  const clearBag = useMallStore((s) => s.clearBag);
  const clearWishlist = useMallStore((s) => s.clearWishlist);
  const clearRecent = useMallStore((s) => s.clearRecent);
  const clearCompare = useMallStore((s) => s.clearCompare);
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  useEffect(() => setHydrated(true), []);

  const byCat = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach((p) => map.set(p.category, (map.get(p.category) ?? 0) + 1));
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [products]);

  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2000);
  };

  return (
    <AdminShell title="Insights" lead="Pulse of catalog depth and shopper signals on this device.">
      {toast && <div className="admin-toast">{toast}</div>}
      <div className="admin-top-actions" style={{ marginBottom: "1rem" }}>
        <button
          type="button"
          className="ghost"
          onClick={() => {
            refresh();
            flash("Catalog refreshed");
          }}
        >
          Refresh catalog
        </button>
        <button
          type="button"
          className="ghost"
          onClick={() => {
            clearBag();
            flash("Bag cleared");
          }}
        >
          Clear bag
        </button>
        <button
          type="button"
          className="ghost"
          onClick={() => {
            clearWishlist();
            flash("Wishlist cleared");
          }}
        >
          Clear wishlist
        </button>
        <button
          type="button"
          className="ghost"
          onClick={() => {
            clearRecent();
            clearCompare();
            flash("Recent + compare cleared");
          }}
        >
          Clear recent
        </button>
        <Link href="/shop" className="ghost">
          Open shop →
        </Link>
      </div>

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
              <i style={{ width: `${Math.min(100, (n / Math.max(1, products.length)) * 100)}%` }} />
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
