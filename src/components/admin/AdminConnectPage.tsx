"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";

type Status = {
  connect?: { summary: string; steps: string[]; env: string[] };
  connector?: { label?: string; mode?: string; detail?: string };
  dataSource?: string;
};

export function AdminConnectPage() {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    fetch("/api/admin/status")
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => {});
  }, []);

  return (
    <AdminShell
      title="Connect backend"
      lead="Any company can plug SQL, NoSQL, HTTP, or JSON — storefront adapts like Shopify."
    >
      <section className="admin-panel admin-connect">
        <h2>How it works</h2>
        <p>{status?.connect?.summary}</p>
        <ol>
          {(status?.connect?.steps ?? []).map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
        <h3>Environment keys</h3>
        <div className="admin-env">
          {(status?.connect?.env ?? []).map((e) => (
            <code key={e}>{e}</code>
          ))}
        </div>
        <p className="muted">
          Now: <strong>{status?.connector?.mode ?? status?.dataSource}</strong>
          {status?.connector?.detail ? ` · ${status.connector.detail}` : ""}
        </p>
        <p className="muted">
          APIs: <code>POST /api/catalog/ingest</code> · <code>/api/admin/products</code>
        </p>
      </section>
    </AdminShell>
  );
}
