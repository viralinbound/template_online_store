"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useMallStore } from "@/store/useMallStore";

type Status = {
  products?: number;
  floors?: number;
  stores?: number;
  dataSource?: string;
  connector?: { label?: string };
};

export function AdminOverviewPage() {
  const [status, setStatus] = useState<Status | null>(null);
  const orders = useMallStore((s) => s.orders);
  const bag = useMallStore((s) => s.bag);
  const wishlist = useMallStore((s) => s.wishlist);

  useEffect(() => {
    fetch("/api/admin/status")
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => {});
  }, []);

  return (
    <AdminShell
      title="Overview"
      lead="Track catalog, orders, and live source — change anything from the segments."
    >
      <div className="admin-stats">
        <article>
          <em>Products</em>
          <strong>{status?.products ?? "—"}</strong>
        </article>
        <article>
          <em>Orders (device)</em>
          <strong>{orders.length}</strong>
        </article>
        <article>
          <em>Open carts</em>
          <strong>{bag.length}</strong>
        </article>
        <article>
          <em>Source</em>
          <strong>{status?.dataSource ?? "—"}</strong>
        </article>
      </div>

      <div className="admin-cards">
        <Link href="/admin/products" className="admin-card">
          <strong>Products</strong>
          <p>Add, edit, delete SKUs — live sync to storefront.</p>
        </Link>
        <Link href="/admin/orders" className="admin-card">
          <strong>Orders</strong>
          <p>Track demo order timeline and reorder activity.</p>
        </Link>
        <Link href="/admin/insights" className="admin-card">
          <strong>Insights</strong>
          <p>Wishlist, bag, floors & boutique pulse.</p>
        </Link>
        <Link href="/admin/connect" className="admin-card">
          <strong>Connect backend</strong>
          <p>Shopify-like: SQL, NoSQL, HTTP, or JSON ingest.</p>
        </Link>
      </div>

      <p className="muted" style={{ marginTop: "1rem" }}>
        Connector: {status?.connector?.label ?? "local"} · Saved ♥ {wishlist.length} · Floors{" "}
        {status?.floors ?? "—"} · Stores {status?.stores ?? "—"}
      </p>
    </AdminShell>
  );
}
