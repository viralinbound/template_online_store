"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useCatalog } from "@/components/CatalogProvider";

type Status = {
  connect?: { summary: string; steps: string[]; env: string[] };
  connector?: { label?: string; mode?: string; detail?: string };
  dataSource?: string;
  products?: number;
  ok?: boolean;
  error?: string;
};

type BrandForm = {
  brandName: string;
  tagline: string;
  supportEmail: string;
  logoUrl: string;
  faviconUrl: string;
  couponCode: string;
  brand: string;
  accent: string;
  accent2: string;
};

const SAMPLE_INGEST = `{
  "config": {
    "brandName": "Acme Shop",
    "tagline": "Built for your customers",
    "logoUrl": "https://example.com/logo.png",
    "faviconUrl": "https://example.com/favicon.ico",
    "couponCode": "ACME10",
    "theme": {
      "brand": "#0b3d3a",
      "accent": "#12b5a0",
      "accent2": "#ff3d5a"
    }
  },
  "products": [{ "name": "Sample Tee", "price": 999, "category": "fashion" }]
}`;

export function AdminConnectPage() {
  const { config, refresh } = useCatalog();
  const [status, setStatus] = useState<Status | null>(null);
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [form, setForm] = useState<BrandForm>({
    brandName: config.brandName,
    tagline: config.tagline,
    supportEmail: config.supportEmail ?? "",
    logoUrl: config.logoUrl ?? "",
    faviconUrl: config.faviconUrl ?? "",
    couponCode: config.couponCode ?? "ORVA10",
    brand: config.theme?.brand ?? "#0b3d3a",
    accent: config.theme?.accent ?? "#12b5a0",
    accent2: config.theme?.accent2 ?? "#ff3d5a",
  });

  useEffect(() => {
    setForm({
      brandName: config.brandName,
      tagline: config.tagline,
      supportEmail: config.supportEmail ?? "",
      logoUrl: config.logoUrl ?? "",
      faviconUrl: config.faviconUrl ?? "",
      couponCode: config.couponCode ?? "ORVA10",
      brand: config.theme?.brand ?? "#0b3d3a",
      accent: config.theme?.accent ?? "#12b5a0",
      accent2: config.theme?.accent2 ?? "#ff3d5a",
    });
  }, [config]);

  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2400);
  };

  const load = useCallback(async () => {
    setBusy(true);
    try {
      const data = await fetch("/api/admin/status", { cache: "no-store" }).then((r) => r.json());
      setStatus(data);
      flash(data.ok ? "Status OK" : data.error || "Status loaded");
    } catch {
      flash("Failed to reach /api/admin/status");
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      flash(`Copied ${label}`);
    } catch {
      flash("Clipboard blocked");
    }
  };

  const saveBrand = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/brand", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName: form.brandName,
          tagline: form.tagline,
          supportEmail: form.supportEmail,
          logoUrl: form.logoUrl,
          faviconUrl: form.faviconUrl,
          couponCode: form.couponCode,
          theme: {
            brand: form.brand,
            brandDeep: form.brand,
            accent: form.accent,
            accent2: form.accent2,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      refresh();
      flash("Brand kit live — website updates automatically");
    } catch (e) {
      flash(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell
      title="Connect backend"
      lead="Plug any company SQL, NoSQL, HTTP, or JSON feed — brand, logo, and colors update the full website automatically."
    >
      <div className="admin-top-actions" style={{ marginBottom: "1rem" }}>
        <button type="button" className="primary" disabled={busy} onClick={() => void load()}>
          {busy ? "Checking…" : "Test connection"}
        </button>
        <button type="button" className="ghost" onClick={() => void copy("POST /api/catalog/ingest", "ingest path")}>
          Copy ingest path
        </button>
        <button type="button" className="ghost" onClick={() => void copy(SAMPLE_INGEST, "sample JSON")}>
          Copy sample payload
        </button>
      </div>
      {toast && <div className="admin-toast">{toast}</div>}

      <section className="admin-panel admin-connect" style={{ marginBottom: "1rem" }}>
        <h2>Brand kit · live storefront</h2>
        <p className="muted">
          Change company name, logo, and colors here — header, footer, theme, and tab title update across the site.
        </p>
        <div className="admin-form" style={{ marginTop: "0.85rem" }}>
          <label>
            Brand name
            <input
              value={form.brandName}
              onChange={(e) => setForm((f) => ({ ...f, brandName: e.target.value }))}
            />
          </label>
          <label>
            Coupon code
            <input
              value={form.couponCode}
              onChange={(e) => setForm((f) => ({ ...f, couponCode: e.target.value }))}
            />
          </label>
          <label className="full">
            Tagline
            <input value={form.tagline} onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))} />
          </label>
          <label>
            Support email
            <input
              value={form.supportEmail}
              onChange={(e) => setForm((f) => ({ ...f, supportEmail: e.target.value }))}
            />
          </label>
          <label>
            Logo URL
            <input
              value={form.logoUrl}
              onChange={(e) => setForm((f) => ({ ...f, logoUrl: e.target.value }))}
              placeholder="https://…/logo.png"
            />
          </label>
          <label>
            Favicon URL
            <input
              value={form.faviconUrl}
              onChange={(e) => setForm((f) => ({ ...f, faviconUrl: e.target.value }))}
              placeholder="https://…/favicon.ico"
            />
          </label>
          <label>
            Brand color
            <input
              type="color"
              value={form.brand}
              onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
            />
          </label>
          <label>
            Accent color
            <input
              type="color"
              value={form.accent}
              onChange={(e) => setForm((f) => ({ ...f, accent: e.target.value }))}
            />
          </label>
          <label>
            Highlight color
            <input
              type="color"
              value={form.accent2}
              onChange={(e) => setForm((f) => ({ ...f, accent2: e.target.value }))}
            />
          </label>
        </div>
        <div className="admin-top-actions" style={{ marginTop: "1rem" }}>
          <button type="button" className="primary" disabled={saving || !form.brandName.trim()} onClick={() => void saveBrand()}>
            {saving ? "Saving…" : "Save brand kit"}
          </button>
          <a href="/" className="ghost">
            Preview storefront →
          </a>
        </div>
      </section>

      <section className="admin-panel admin-connect">
        <h2>How any company connects</h2>
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
          APIs: <code>POST /api/catalog/ingest</code> · <code>PATCH /api/admin/brand</code> ·{" "}
          <code>/api/admin/products</code>
        </p>
        <p className="muted">
          Include <code>config.brandName</code>, <code>logoUrl</code>, and <code>theme</code> in any ingest — the UI
          restyles itself on the next sync.
        </p>
      </section>
    </AdminShell>
  );
}
