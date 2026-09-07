"use client";

import { useCatalog } from "@/components/CatalogProvider";

/** Small live indicator — shows when UI is driven by SQL / NoSQL / API / ingest */
export function LiveSourceBadge() {
  const { live, sourceLabel, loading, refresh, lastSyncAt } = useCatalog();

  if (loading) {
    return <span className="mm-live-badge mm-live-loading">Syncing…</span>;
  }

  return (
    <button
      type="button"
      className={`mm-live-badge ${live ? "on" : ""}`}
      title={lastSyncAt ? `Last sync ${lastSyncAt}` : "Catalog source"}
      onClick={() => refresh()}
    >
      <i />
      {live ? `Live · ${sourceLabel}` : "Demo catalog"}
    </button>
  );
}
