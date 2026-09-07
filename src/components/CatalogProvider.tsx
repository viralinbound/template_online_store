"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { mallFloors } from "@/data/mallData";
import { defaultSiteConfig } from "@/lib/data/types";
import type { CatalogPayload, MallFloor, MallSiteConfig, Product } from "@/types/mall";

type CatalogStatus = {
  ok: boolean;
  live: boolean;
  source?: string;
  connector?: { label?: string; mode?: string; detail?: string };
  products?: number;
  pollMs?: number;
  error?: string;
};

type CatalogContextValue = {
  ready: boolean;
  loading: boolean;
  error: string | null;
  floors: MallFloor[];
  config: MallSiteConfig;
  products: Product[];
  live: boolean;
  sourceLabel: string;
  lastSyncAt: string | null;
  refresh: () => void;
};

const CatalogContext = createContext<CatalogContextValue | null>(null);

function flatten(floors: MallFloor[]): Product[] {
  return floors.flatMap((f) => f.stores.flatMap((s) => s.products));
}

const DEFAULT_POLL =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_MALL_LIVE_POLL_MS
    ? Number(process.env.NEXT_PUBLIC_MALL_LIVE_POLL_MS)
    : 8000;

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [payload, setPayload] = useState<CatalogPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [live, setLive] = useState(false);
  const [sourceLabel, setSourceLabel] = useState("local");
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const [pollMs, setPollMs] = useState(DEFAULT_POLL);
  const fingerprint = useRef<string>("");

  const pull = useCallback(async (fresh: boolean) => {
    const url = fresh ? "/api/catalog?fresh=1" : "/api/catalog?fresh=1";
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Catalog ${res.status}`);
    const data = (await res.json()) as CatalogPayload;
    const fp = `${data.generatedAt}:${data.floors.length}:${data.config.dataSource}:${data.config.brandName}:${data.config.logoUrl ?? ""}:${data.config.theme?.brand ?? ""}:${data.config.theme?.accent ?? ""}`;
    if (fp !== fingerprint.current) {
      fingerprint.current = fp;
      setPayload(data);
    } else if (!fingerprint.current) {
      setPayload(data);
      fingerprint.current = fp;
    }
    setSourceLabel(data.config.dataSource);
    setLastSyncAt(new Date().toISOString());
    setLive(data.config.dataSource !== "local");
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    pull(true).catch((err: unknown) => {
      if (cancelled) return;
      setPayload({
        config: { ...defaultSiteConfig, dataSource: "local" },
        floors: mallFloors,
        generatedAt: new Date().toISOString(),
      });
      setError(err instanceof Error ? err.message : "Using local catalog");
      setLive(false);
      setSourceLabel("local");
      setLoading(false);
    });

    fetch("/api/catalog/status")
      .then((r) => r.json())
      .then((s: CatalogStatus) => {
        if (cancelled) return;
        if (s.pollMs) setPollMs(s.pollMs);
        if (s.connector?.label) setSourceLabel(s.connector.label);
        setLive(Boolean(s.live && s.source && s.source !== "local"));
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [tick, pull]);

  // Near real-time: poll catalog so SQL/NoSQL/ingest updates appear without reload
  useEffect(() => {
    if (pollMs <= 0) return;
    const id = window.setInterval(() => {
      pull(true).catch(() => {});
    }, pollMs);
    return () => window.clearInterval(id);
  }, [pollMs, pull]);

  const value = useMemo<CatalogContextValue>(() => {
    const floors = payload?.floors ?? mallFloors;
    const config = payload?.config ?? defaultSiteConfig;
    return {
      ready: !loading,
      loading,
      error,
      floors,
      config,
      products: flatten(floors),
      live,
      sourceLabel,
      lastSyncAt,
      refresh: () => setTick((t) => t + 1),
    };
  }, [payload, loading, error, live, sourceLabel, lastSyncAt]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) {
    throw new Error("useCatalog must be used within CatalogProvider");
  }
  return ctx;
}

export function useCatalogOptional() {
  return useContext(CatalogContext);
}
