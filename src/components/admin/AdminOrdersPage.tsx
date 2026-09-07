"use client";

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
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const money = (n: number) => formatMoney(n, config.currency, config.locale);

  return (
    <AdminShell title="Orders" lead="Track every demo order timeline and advance status.">
      {!hydrated ? (
        <p className="muted">Loading…</p>
      ) : orders.length === 0 ? (
        <section className="admin-panel">
          <p className="muted">No orders on this device yet. Place one from the storefront checkout.</p>
        </section>
      ) : (
        <div className="orders-grid">
          {orders.map((o) => (
            <OrderCard
              key={o.id}
              order={o}
              money={money}
              onAdvance={() => advance(o.id)}
              onReorder={() => reorder(o.id)}
            />
          ))}
        </div>
      )}
    </AdminShell>
  );
}
