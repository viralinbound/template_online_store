import { defaultSiteConfig } from "@/lib/data/types";
import type {
  CatalogPayload,
  MallCategory,
  MallFloor,
  MallSiteConfig,
  Product,
  ProductBadge,
  ProductReview,
  StoreNode,
} from "@/types/mall";

const CATEGORIES: MallCategory[] = [
  "fashion",
  "beauty",
  "electronics",
  "sports",
  "home",
  "luxury",
  "food",
  "gaming",
];

type Loose = Record<string, unknown>;

function asRecord(v: unknown): Loose | null {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Loose) : null;
}

function pick<T = unknown>(row: Loose, keys: string[]): T | undefined {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null && row[key] !== "") {
      return row[key] as T;
    }
    // nested common shapes: row.attributes.title
    if (key.includes(".")) {
      const parts = key.split(".");
      let cur: unknown = row;
      for (const p of parts) {
        const r = asRecord(cur);
        if (!r) {
          cur = undefined;
          break;
        }
        cur = r[p];
      }
      if (cur !== undefined && cur !== null && cur !== "") return cur as T;
    }
  }
  return undefined;
}

function asString(v: unknown, fallback = ""): string {
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return fallback;
}

function asNumber(v: unknown, fallback = 0): number {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v.replace(/[^0-9.-]/g, ""));
    return Number.isFinite(n) ? n : fallback;
  }
  return fallback;
}

function asStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map((x) => asString(x)).filter(Boolean);
  if (typeof v === "string") {
    return v
      .split(/[,|]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function toCategory(raw: unknown): MallCategory {
  const s = asString(raw, "fashion").toLowerCase();
  const hit = CATEGORIES.find((c) => s.includes(c));
  if (hit) return hit;
  if (s.includes("cloth") || s.includes("apparel") || s.includes("wear")) return "fashion";
  if (s.includes("cosmetic") || s.includes("skin")) return "beauty";
  if (s.includes("phone") || s.includes("laptop") || s.includes("tech")) return "electronics";
  if (s.includes("fitness") || s.includes("sport")) return "sports";
  if (s.includes("furniture") || s.includes("decor")) return "home";
  if (s.includes("jewel") || s.includes("watch") || s.includes("premium")) return "luxury";
  if (s.includes("food") || s.includes("cafe") || s.includes("grocery")) return "food";
  if (s.includes("game") || s.includes("console")) return "gaming";
  return "fashion";
}

function toBadges(raw: unknown): ProductBadge[] | undefined {
  const list = asStringArray(raw).map((b) => b.toLowerCase());
  const out: ProductBadge[] = [];
  for (const b of list) {
    if (b === "new" || b === "sale" || b === "limited" || b === "bestseller" || b === "exclusive") {
      out.push(b);
    }
  }
  return out.length ? out : undefined;
}

function toReviews(raw: unknown): ProductReview[] | undefined {
  if (!Array.isArray(raw) || !raw.length) return undefined;
  return raw.map((item, i) => {
    const r = asRecord(item) ?? {};
    return {
      id: asString(pick(r, ["id", "_id"]), `rev-${i}`),
      author: asString(pick(r, ["author", "name", "user", "username"]), "Guest"),
      rating: asNumber(pick(r, ["rating", "stars", "score"]), 5),
      title: asString(pick(r, ["title", "headline"])) || undefined,
      body: asString(pick(r, ["body", "comment", "text", "content", "review"]), ""),
      createdAt: asString(pick(r, ["createdAt", "created_at", "date"]), new Date().toISOString()),
    };
  });
}

const DEFAULT_THEME = {
  primary: "#0f3d40",
  accent: "#14999c",
  floor: "#f2f8f8",
  wall: "#d9ecec",
};

/**
 * Map one loose ecommerce row (SQL / NoSQL / Shopify / Woo / CSV export JSON)
 * into MegaMall Product. Unknown extra columns are ignored.
 */
export function normalizeProduct(raw: unknown, index = 0, storeId = "store-main"): Product {
  const row = asRecord(raw) ?? {};
  const name = asString(
    pick(row, ["name", "title", "product_name", "productName", "label"]),
    `Product ${index + 1}`,
  );
  const id = asString(pick(row, ["id", "_id", "product_id", "productId", "sku"]), `p-${index}`);
  const price = asNumber(
    pick(row, ["price", "amount", "sale_price", "salePrice", "unit_price", "unitPrice", "cost"]),
    0,
  );
  const compareAt = pick(row, [
    "compareAtPrice",
    "compare_at_price",
    "mrp",
    "regular_price",
    "regularPrice",
    "list_price",
  ]);
  const image = asString(
    pick(row, [
      "image",
      "imageUrl",
      "image_url",
      "thumbnail",
      "thumb",
      "featured_image",
      "featuredImage",
      "photo",
      "images.0",
      "media.0.url",
    ]),
    "",
  );
  const galleryRaw = pick(row, ["gallery", "images", "photos", "media"]);
  let gallery: string[] | undefined;
  if (Array.isArray(galleryRaw)) {
    gallery = galleryRaw
      .map((g) => {
        if (typeof g === "string") return g;
        const r = asRecord(g);
        return r ? asString(pick(r, ["url", "src", "image", "path"])) : "";
      })
      .filter(Boolean);
  }

  const category = toCategory(pick(row, ["category", "category_name", "categoryName", "type", "collection"]));
  const stockVal = pick(row, ["stock", "inventory", "qty", "quantity", "stock_qty", "stockQuantity"]);

  return {
    id,
    slug: asString(pick(row, ["slug", "handle", "permalink"]), slugify(name)),
    sku: asString(pick(row, ["sku", "SKU", "code", "barcode"]), `SKU-${id}`),
    name,
    brand: asString(pick(row, ["brand", "vendor", "manufacturer", "store_name"])) || undefined,
    price,
    compareAtPrice: compareAt == null ? null : asNumber(compareAt),
    currency: asString(pick(row, ["currency", "currency_code", "currencyCode"]), "INR"),
    rating: asNumber(pick(row, ["rating", "avg_rating", "averageRating", "stars"]), 4.5),
    reviewCount: asNumber(pick(row, ["reviewCount", "review_count", "reviews_count", "num_reviews"]), 0),
    reviews: toReviews(pick(row, ["reviews", "ratings"])),
    colors: asStringArray(pick(row, ["colors", "color", "colour", "variants.colors"])).length
      ? asStringArray(pick(row, ["colors", "color", "colour"]))
      : ["Default"],
    sizes: asStringArray(pick(row, ["sizes", "size", "variants.sizes"])).length
      ? asStringArray(pick(row, ["sizes", "size"]))
      : ["One Size"],
    shelfIndex: asNumber(pick(row, ["shelfIndex", "shelf_index", "position", "sort"]), index),
    storeId: asString(pick(row, ["storeId", "store_id", "shop_id", "vendor_id"]), storeId),
    category,
    subcategory: asString(
      pick(row, ["subcategory", "sub_category", "subCategory", "department", "aisle"]),
      category,
    ),
    image: image || `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80`,
    gallery,
    description: asString(
      pick(row, ["description", "desc", "body", "body_html", "details", "summary"]),
      name,
    ),
    tags: asStringArray(pick(row, ["tags", "keywords", "labels"])) || undefined,
    badges: toBadges(pick(row, ["badges", "badge", "labels", "flags"])),
    stock: stockVal == null ? null : asNumber(stockVal),
    shippingNote: asString(pick(row, ["shippingNote", "shipping", "delivery"])) || undefined,
    returnNote: asString(pick(row, ["returnNote", "returns", "return_policy"])) || undefined,
    updatedAt: asString(pick(row, ["updatedAt", "updated_at", "modified"]), new Date().toISOString()),
  };
}

function normalizeStore(raw: unknown, index = 0, floor = 0): StoreNode {
  const row = asRecord(raw) ?? {};
  const name = asString(pick(row, ["name", "title", "store_name", "shop"]), `Store ${index + 1}`);
  const id = asString(pick(row, ["id", "_id", "store_id", "shop_id"]), `store-${index}`);
  const productsRaw = pick(row, ["products", "items", "catalog"]);
  const products = Array.isArray(productsRaw)
    ? productsRaw.map((p, i) => normalizeProduct(p, i, id))
    : [];

  const themeRaw = asRecord(pick(row, ["theme"]));
  return {
    id,
    slug: asString(pick(row, ["slug", "handle"]), slugify(name)),
    name,
    category: toCategory(pick(row, ["category", "type"])),
    subcategory: asString(pick(row, ["subcategory", "department"]), "General"),
    floor: asNumber(pick(row, ["floor", "level", "floor_index"]), floor),
    wing: "plaza",
    theme: {
      primary: asString(themeRaw?.primary, DEFAULT_THEME.primary),
      accent: asString(themeRaw?.accent, DEFAULT_THEME.accent),
      floor: asString(themeRaw?.floor, DEFAULT_THEME.floor),
      wall: asString(themeRaw?.wall, DEFAULT_THEME.wall),
    },
    doorImage: asString(
      pick(row, ["doorImage", "door_image", "image", "cover", "banner"]),
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&q=80",
    ),
    products,
    description: asString(pick(row, ["description", "about"])) || undefined,
    hours: asString(pick(row, ["hours", "opening_hours"])) || undefined,
    featured: Boolean(pick(row, ["featured", "is_featured"])),
  };
}

function productsToFloors(products: Product[]): MallFloor[] {
  const byStore = new Map<string, Product[]>();
  for (const p of products) {
    const key = p.storeId || p.brand || "main";
    const list = byStore.get(key) ?? [];
    list.push(p);
    byStore.set(key, list);
  }

  const stores: StoreNode[] = [...byStore.entries()].map(([storeId, items], i) => {
    const first = items[0];
    const name = first?.brand || `Boutique ${i + 1}`;
    return {
      id: storeId,
      slug: slugify(name),
      name,
      category: first?.category ?? "fashion",
      subcategory: first?.subcategory ?? "General",
      floor: Math.floor(i / 8),
      wing: "plaza",
      theme: DEFAULT_THEME,
      doorImage: first?.image || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&q=80",
      products: items.map((p, idx) => ({ ...p, storeId, shelfIndex: idx })),
      featured: i < 2,
    };
  });

  const floorMap = new Map<number, StoreNode[]>();
  for (const s of stores) {
    const list = floorMap.get(s.floor) ?? [];
    list.push(s);
    floorMap.set(s.floor, list);
  }

  if (!floorMap.size) {
    return [
      {
        id: "floor-0",
        level: 0,
        label: "G",
        title: "Main Floor",
        categoryName: "All",
        subcategories: [],
        stores: [],
      },
    ];
  }

  return [...floorMap.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([level, floorStores]) => ({
      id: `floor-${level}`,
      level,
      label: level === 0 ? "G" : String(level).padStart(2, "0"),
      title: level === 0 ? "Ground Atrium" : `Level ${level}`,
      categoryName: [...new Set(floorStores.map((s) => s.category))].join(" · ") || "Retail",
      subcategories: [...new Set(floorStores.map((s) => s.subcategory))],
      stores: floorStores,
    }));
}

function mergeConfig(raw: unknown, dataSource: MallSiteConfig["dataSource"]): MallSiteConfig {
  const row = asRecord(raw) ?? {};
  const flags = asRecord(pick(row, ["featureFlags", "features"])) ?? {};
  return {
    ...defaultSiteConfig,
    brandName: asString(pick(row, ["brandName", "brand", "name", "store_name"]), defaultSiteConfig.brandName),
    tagline: asString(pick(row, ["tagline", "subtitle", "tag_line"]), defaultSiteConfig.tagline),
    currency: asString(pick(row, ["currency", "currency_code"]), defaultSiteConfig.currency),
    locale: asString(pick(row, ["locale", "lang"]), defaultSiteConfig.locale),
    supportEmail: asString(pick(row, ["supportEmail", "email"]), defaultSiteConfig.supportEmail),
    trustPoints: asStringArray(pick(row, ["trustPoints", "trust", "guarantees"])).length
      ? asStringArray(pick(row, ["trustPoints", "trust", "guarantees"]))
      : defaultSiteConfig.trustPoints,
    featureFlags: {
      ...defaultSiteConfig.featureFlags,
      explore: flags.explore !== false,
      shop: flags.shop !== false,
      directory: flags.directory !== false,
      wishlist: flags.wishlist !== false,
      reviews: flags.reviews !== false,
      coupons: flags.coupons !== false,
      guestCheckout: Boolean(flags.guestCheckout),
    },
    dataSource,
  };
}

/**
 * Accept ANY common ecommerce dump and produce CatalogPayload.
 * Supported shapes:
 * - CatalogPayload { floors, config }
 * - { products: [...] }
 * - { stores: [...] }
 * - { data: [...] } / { items: [...] } / { rows: [...] }
 * - bare Product[]
 * - { documents: [...] } (Mongo style)
 */
export function normalizeCatalog(
  input: unknown,
  dataSource: MallSiteConfig["dataSource"] = "api",
): CatalogPayload {
  // Already MegaMall shaped
  const root = asRecord(input);
  if (root && Array.isArray(root.floors)) {
    return {
      config: mergeConfig(root.config, dataSource),
      floors: root.floors as MallFloor[],
      generatedAt: asString(root.generatedAt, new Date().toISOString()),
    };
  }

  let products: Product[] = [];
  let stores: StoreNode[] | null = null;

  if (Array.isArray(input)) {
    products = input.map((p, i) => normalizeProduct(p, i));
  } else if (root) {
    const storeList = pick(root, ["stores", "shops", "vendors", "boutiques"]);
    if (Array.isArray(storeList) && storeList.length) {
      stores = storeList.map((s, i) => normalizeStore(s, i));
      products = stores.flatMap((s) => s.products);
    } else {
      const list =
        pick(root, ["products", "items", "rows", "data", "documents", "results", "catalog"]) ??
        null;
      if (Array.isArray(list)) {
        products = list.map((p, i) => normalizeProduct(p, i));
      }
    }
  }

  const floors = stores
    ? productsToFloors(stores.flatMap((s) => s.products.map((p) => ({ ...p, storeId: s.id, brand: p.brand || s.name }))))
    : productsToFloors(products);

  // If we had explicit stores with empty products but products at root, re-attach by storeId
  if (stores?.length && products.length && floors.every((f) => f.stores.every((s) => !s.products.length))) {
    return {
      config: mergeConfig(root?.config, dataSource),
      floors: productsToFloors(products),
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    config: mergeConfig(root?.config, dataSource),
    floors,
    generatedAt: new Date().toISOString(),
  };
}
