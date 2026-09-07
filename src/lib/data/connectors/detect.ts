import { existsSync } from "fs";
import path from "path";
import type { DetectedConnector } from "@/lib/data/types";

const LIVE_MARKER = path.join(process.cwd(), "data", ".mall-live");
const LIVE_FILE = path.join(process.cwd(), "data", "live-catalog.json");

/**
 * Auto-detect which backend to use from env.
 * Priority: live JSON file → HTTP catalog → SQL REST → Mongo/NoSQL → DATABASE_URL → local
 */
export function detectConnector(): DetectedConnector {
  if (process.env.MALL_DATA_SOURCE?.toLowerCase() === "local") {
    return { mode: "local", label: "Built-in demo catalog", detail: "local" };
  }

  const catalogPath = process.env.MALL_CATALOG_PATH;
  if (catalogPath) {
    return {
      mode: "json",
      label: "JSON / file sync",
      detail: catalogPath,
    };
  }

  // Activated by POST /api/catalog/ingest (writes .mall-live marker)
  if (existsSync(LIVE_MARKER) && existsSync(LIVE_FILE)) {
    return {
      mode: "json",
      label: "Live ingested catalog",
      detail: "data/live-catalog.json",
    };
  }

  if (process.env.MALL_CATALOG_URL) {
    return {
      mode: "api",
      label: "HTTP catalog API",
      detail: process.env.MALL_CATALOG_URL,
    };
  }

  if (
    process.env.MALL_SQL_REST_URL ||
    process.env.SUPABASE_URL
  ) {
    return {
      mode: "sql",
      label: "SQL (Postgres / MySQL / Supabase REST)",
      detail:
        process.env.MALL_SQL_REST_URL ||
        process.env.SUPABASE_URL ||
        "sql",
    };
  }

  if (
    process.env.MALL_MONGO_DATA_API_URL ||
    process.env.MALL_NOSQL_URL
  ) {
    return {
      mode: "nosql",
      label: "NoSQL (MongoDB / document API)",
      detail:
        process.env.MALL_MONGO_DATA_API_URL ||
        process.env.MALL_NOSQL_URL ||
        "nosql",
    };
  }

  // Raw driver URLs: use ingest or REST bridge — do not crash the UI
  if (process.env.DATABASE_URL) {
    const url = process.env.DATABASE_URL;
    if (/^mongodb(\+srv)?:/i.test(url)) {
      return {
        mode: "database",
        label: "Mongo URL detected — set MALL_MONGO_DATA_API_URL or POST /api/catalog/ingest",
        detail: url.split("@").pop() || "mongodb",
      };
    }
    if (/^(postgres|postgresql|mysql)/i.test(url)) {
      return {
        mode: "database",
        label: "SQL URL detected — set MALL_SQL_REST_URL (Supabase) or POST /api/catalog/ingest",
        detail: url.split("@").pop() || "sql",
      };
    }
    return {
      mode: "database",
      label: "DATABASE_URL set — use ingest API or REST connector",
      detail: url.split("@").pop() || "database",
    };
  }

  return {
    mode: "local",
    label: "Built-in demo catalog",
    detail: "local",
  };
}

export function liveCatalogPaths() {
  return { marker: LIVE_MARKER, file: LIVE_FILE, relative: "data/live-catalog.json" };
}
