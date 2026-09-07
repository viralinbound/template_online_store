"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCatalog } from "@/components/CatalogProvider";
import { OrderCard } from "@/components/commerce/CheckoutPanel";
import { AtmosphereBand } from "@/components/shell/AtmosphereBand";
import { OrvaShell } from "@/components/shell/OrvaShell";
import { PageHero } from "@/components/shell/PageHero";
import { SectionHead } from "@/components/shell/SectionHead";
import { formatMoney } from "@/lib/money";
import { landingHeroImage } from "@/lib/images";
import { useMallStore } from "@/store/useMallStore";

export function OrdersPage() {
  const { config } = useCatalog();
  const orders = useMallStore((s) => s.orders);
  const advanceOrderStatus = useMallStore((s) => s.advanceOrderStatus);
  const reorder = useMallStore((s) => s.reorder);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  const money = (n: number) => formatMoney(n, config.currency, config.locale);

  return (
    <OrvaShell>
      <PageHero
        kicker="Account"
        title="Orders"
        lead="Track demo orders, advance status, and reorder in one tap."
        image={landingHeroImage()}
        actions={
          <Link href="/shop" className="primary">
            Keep shopping
          </Link>
        }
      />
      <AtmosphereBand items={["Orders", "Tracking", "Reorder", config.brandName]} />

      <section className="orva-land-block orders-page">
        <SectionHead
          eyebrow="History"
          title={hydrated ? `${orders.length} order${orders.length === 1 ? "" : "s"}` : "Loading…"}
        />
        {!hydrated ? (
          <p className="muted">Loading…</p>
        ) : orders.length === 0 ? (
          <>
            <p className="muted">No orders yet.</p>
            <Link href="/shop" className="primary inline-cta">
              Start shopping
            </Link>
          </>
        ) : (
          <div className="orders-grid">
            {orders.map((o) => (
              <OrderCard
                key={o.id}
                order={o}
                money={money}
                onAdvance={() => advanceOrderStatus(o.id)}
                onReorder={() => reorder(o.id)}
              />
            ))}
          </div>
        )}
      </section>
    </OrvaShell>
  );
}
