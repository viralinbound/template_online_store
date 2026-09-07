"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";

type Status = {
  connect?: { summary: string; steps: string[]; env: string[] };
  connector?: { label?: string; mode?: string; detail?: string };
  dataSource?: string;
  products?: number;
  ok?: boolean;
  error?: string;
};

export function AdminConnectPage() {
  const [status, setStatus] = useState<Status | null>(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const load = useCallback(async () => {
    setBusy(true);
    try {
      const data = await fetch("/api/admin/status", { cache: "no-store" }).then((r) => r.json());
      setStatus(data);
      setToast(data.ok ? "Status OK" : data.error || "Status loaded");
    } catch {
      setToast("Failed to reach /api/admin/status");
    } finally {
      setBusy(false);
      window.setTimeout(() => setToast(null), 2200);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast(`Copied ${label}`);
    } catch {
      setToast("Clipboard blocked");
    }
    window.setTimeout(() => setToast(null), 2000);
  };

  return (
    <AdminShell
      title="Connect backend"
      lead="Any company can plug SQL, NoSQL, HTTP, or JSON — storefront adapts like Shopify."
    >
      <div className="admin-top-actions" style={{ marginBottom: "1rem" }}>
        <button type="button" className="primary" disabled={busy} onClick={() => void load()}>
          {busy ? "Checking…" : "Test connection"}
        </button>
        <button
          type="button"
          className="ghost"
          onClick={() => void copy("POST /api/catalog/ingest", "ingest path")}
        >
          Copy ingest path
        </button>
        <button
          type="button"
          className="ghost"
          onClick={() => void copy("/api/admin/products", "products API")}
        >
          Copy products API
        </button>
      </div>
      {toast && <div className="admin-toast">{toast}</div>}
      <section className="admin-panel admin-connect">
        <h2>How it works</h2>
        <p>{status?.connect?.summary ?? "Loading connector docs…"}</p>
        <ol>
          {(status?.connect?.steps ?? []).map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
        <h3>Environment keys</h3>
        <div className="admin-env">
          {(status?.connect?.env ?? []).map((e) => (
            <button key={e} type="button" className="admin-env-chip" onClick={() => void copy(e, e)}>
              <code>{e}</code>
            </button>
          ))}
        </div>
        <p className="muted">
          Now: <strong>{status?.connector?.mode ?? status?.dataSource ?? "—"}</strong>
          {status?.connector?.detail ? ` · ${status.connector.detail}` : ""}
          {status?.products != null ? ` · ${status.products} products` : ""}
        </p>
        <p className="muted">
          APIs: <code>POST /api/catalog/ingest</code> · <code>/api/admin/products</code>
        </p>
      </section>
    </AdminShell>
  );
}
