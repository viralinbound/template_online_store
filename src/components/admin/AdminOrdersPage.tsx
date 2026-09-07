"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { OrderCard } from "@/components/commerce/CheckoutPanel";
import { useCatalog } from "@/components/CatalogProvider";
import { formatMoney } from "@/lib/money";
import { useMallStore } from "@/store/useMallStore";

export function AdminOrdersPage() {
  const { config } = useCatalog();
  const orders = useMallStore((s) => s.orders);
  const advance = useMallStore((s) => s.advanceOrderStatus);
  const reorder = useMallStore((s) => s.reorder);
  const seedDemoOrder = useMallStore((s) => s.seedDemoOrder);
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  useEffect(() => setHydrated(true), []);
  const money = (n: number) => formatMoney(n, config.currency, config.locale);

  return (
    <AdminShell title="Orders" lead="Track every demo order timeline and advance status.">
      <div className="admin-top-actions" style={{ marginBottom: "1rem" }}>
        <button
          type="button"
          className="primary"
          onClick={() => {
            const id = seedDemoOrder();
            setToast(id ? `Seeded ${id}` : "Could not seed order");
            window.setTimeout(() => setToast(null), 2200);
          }}
        >
          + Seed demo order
        </button>
        <Link href="/checkout" className="ghost">
          Open checkout →
        </Link>
      </div>
      {toast && <div className="admin-toast">{toast}</div>}
      {!hydrated ? (
        <p className="muted">Loading…</p>
      ) : orders.length === 0 ? (
        <section className="admin-panel">
          <p className="muted">No orders on this device yet.</p>
          <div className="admin-top-actions" style={{ marginTop: "0.75rem" }}>
            <button type="button" className="primary" onClick={() => seedDemoOrder()}>
              Seed demo order
            </button>
            <Link href="/shop" className="ghost">
              Shop storefront →
            </Link>
          </div>
        </section>
      ) : (
        <div className="orders-grid">
          {orders.map((o) => (
            <OrderCard
              key={o.id}
              order={o}
              money={money}
              onAdvance={() => {
                advance(o.id);
                setToast(`Advanced ${o.id}`);
                window.setTimeout(() => setToast(null), 1800);
              }}
              onReorder={() => {
                const ok = reorder(o.id);
                setToast(ok ? `Reordered ${o.id} into bag` : "Reorder failed");
                window.setTimeout(() => setToast(null), 1800);
              }}
            />
          ))}
        </div>
      )}
    </AdminShell>
  );
}
