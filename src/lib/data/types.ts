import type { CatalogPayload, MallSiteConfig } from "@/types/mall";

/** Default site config — override via DB / env when connected */
export const defaultSiteConfig: MallSiteConfig = {
  brandName: "Orva",
  tagline: "Modern ecommerce · Beautiful shopping",
  currency: "INR",
  locale: "en-IN",
  supportEmail: "hello@orva.shop",
  trustPoints: [
    "Fast checkout",
    "2–4 day delivery",
    "Easy 7-day returns",
    "Secure demo payments",
  ],
  featureFlags: {
    explore: true,
    shop: true,
    directory: true,
    wishlist: true,
    reviews: true,
    coupons: true,
    guestCheckout: true,
  },
  dataSource: "local",
};

/**
 * Connection modes for any SQL / NoSQL / HTTP / JSON source.
 * `auto` picks the first configured env (recommended).
 */
export type CatalogSourceMode =
  | "auto"
  | "local"
  | "api"
  | "json"
  | "sql"
  | "nosql"
  | "database";

export type DetectedConnector = {
  mode: Exclude<CatalogSourceMode, "auto">;
  label: string;
  detail: string;
};

export type CatalogRepository = {
  getCatalog(): Promise<CatalogPayload>;
};

export function resolveCatalogMode(): CatalogSourceMode {
  const explicit = process.env.MALL_DATA_SOURCE?.toLowerCase() as CatalogSourceMode | undefined;
  if (
    explicit === "auto" ||
    explicit === "local" ||
    explicit === "api" ||
    explicit === "json" ||
    explicit === "sql" ||
    explicit === "nosql" ||
    explicit === "database"
  ) {
    return explicit;
  }
  return "auto";
}
