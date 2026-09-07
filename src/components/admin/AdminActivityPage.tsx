"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useCatalog } from "@/components/CatalogProvider";

type Log = { at: string; note: string };

export function AdminActivityPage() {
  const { lastSyncAt, live, sourceLabel, products } = useCatalog();
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    const note = live
      ? `Live sync · ${sourceLabel} · ${products.length} products`
      : `Local catalog · ${products.length} products`;
    setLogs((prev) => [{ at: new Date().toISOString(), note }, ...prev].slice(0, 12));
  }, [lastSyncAt, live, sourceLabel, products.length]);

  return (
    <AdminShell title="Activity" lead="Realtime catalog sync trail — see when the mall updates.">
      <section className="admin-panel">
        <p className="muted">
          Last sync: {lastSyncAt ? new Date(lastSyncAt).toLocaleString() : "—"} · Source{" "}
          <strong>{sourceLabel}</strong>
        </p>
        <ul className="admin-activity">
          {logs.map((l, i) => (
            <li key={`${l.at}-${i}`}>
              <time>{new Date(l.at).toLocaleTimeString()}</time>
              <span>{l.note}</span>
            </li>
          ))}
        </ul>
      </section>
    </AdminShell>
  );
}
