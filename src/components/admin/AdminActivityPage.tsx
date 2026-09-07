"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useCatalog } from "@/components/CatalogProvider";

type Log = { at: string; note: string };

export function AdminActivityPage() {
  const { lastSyncAt, live, sourceLabel, products, refresh } = useCatalog();
  const [logs, setLogs] = useState<Log[]>([]);
  const [busy, setBusy] = useState(false);

  const pushLog = useCallback((note: string) => {
    setLogs((prev) => [{ at: new Date().toISOString(), note }, ...prev].slice(0, 20));
  }, []);

  useEffect(() => {
    const note = live
      ? `Live sync · ${sourceLabel} · ${products.length} products`
      : `Local catalog · ${products.length} products`;
    pushLog(note);
  }, [lastSyncAt, live, sourceLabel, products.length, pushLog]);

  return (
    <AdminShell title="Activity" lead="Realtime catalog sync trail — see when the mall updates.">
      <div className="admin-top-actions" style={{ marginBottom: "1rem" }}>
        <button
          type="button"
          className="primary"
          disabled={busy}
          onClick={() => {
            setBusy(true);
            refresh();
            pushLog(`Manual refresh · ${products.length} products`);
            window.setTimeout(() => setBusy(false), 400);
          }}
        >
          {busy ? "Refreshing…" : "Refresh sync"}
        </button>
        <button
          type="button"
          className="ghost"
          onClick={() => {
            setLogs([]);
            pushLog("Activity cleared");
          }}
        >
          Clear log
        </button>
      </div>
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
