import { defaultSiteConfig } from "@/lib/data/types";
import {
  dig,
  flattenPlatformProduct,
  unwrapEcommercePayload,
} from "@/lib/data/schemaAdapters";
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

/** Pick first present value; supports nested paths with array indexes (images.0.src) */
function pick<T = unknown>(row: Loose, keys: string[]): T | undefined {
  for (const key of keys) {
    if (!key.includes(".")) {
      if (row[key] !== undefined && row[key] !== null && row[key] !== "") {
        return row[key] as T;
      }
      continue;
    }
    const cur = dig(row, key);
    if (cur !== undefined && cur !== null && cur !== "") return cur as T;
  }
  return undefined;
}

function asString(v: unknown, fallback = ""): string {
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  const r = asRecord(v);
  if (r) {
    const nested = r.src ?? r.url ?? r.href ?? r.path ?? r.amount ?? r.value;
    if (nested != null) return asString(nested, fallback);
  }
  return fallback;
}

function asNumber(v: unknown, fallback = 0): number {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v.replace(/[^0-9.-]/g, ""));
    return Number.isFinite(n) ? n : fallback;
  }
  const r = asRecord(v);
  if (r) {
    const amount = r.amount ?? r.value ?? r.price;
    if (amount != null) return asNumber(amount, fallback);
  }
  return fallback;
}

function asStringArray(v: unknown): string[] {
  if (Array.isArray(v)) {
    return v
      .map((x) => {
        if (typeof x === "string" || typeof x === "number") return String(x);
        const r = asRecord(x);
        return r ? asString(r.name ?? r.title ?? r.value ?? r.label) : "";
      })
      .filter(Boolean);
  }
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
  if (s.includes("cloth") || s.includes("apparel") || s.includes("wear") || s.includes("shirt")) return "fashion";
  if (s.includes("cosmetic") || s.includes("skin") || s.includes("makeup") || s.includes("beauty")) return "beauty";
  if (s.includes("phone") || s.includes("laptop") || s.includes("tech") || s.includes("electronic")) return "electronics";
  if (s.includes("fitness") || s.includes("sport") || s.includes("outdoor")) return "sports";
  if (s.includes("furniture") || s.includes("decor") || s.includes("kitchen") || s.includes("home")) return "home";
  if (s.includes("jewel") || s.includes("watch") || s.includes("premium") || s.includes("luxury")) return "luxury";
  if (s.includes("food") || s.includes("cafe") || s.includes("grocery") || s.includes("beverage")) return "food";
  if (s.includes("game") || s.includes("console") || s.includes("gaming")) return "gaming";
  return "fashion";
}

function toBadges(raw: unknown): ProductBadge[] | undefined {
  const list = asStringArray(raw).map((b) => b.toLowerCase());
  const out: ProductBadge[] = [];
  for (const b of list) {
    if (b.includes("new") || b === "new") out.push("new");
    else if (b.includes("sale") || b.includes("discount")) out.push("sale");
    else if (b.includes("limited")) out.push("limited");
    else if (b.includes("best") || b.includes("bestseller") || b.includes("best-seller")) out.push("bestseller");
    else if (b.includes("exclusive")) out.push("exclusive");
  }
  return out.length ? [...new Set(out)] : undefined;
}

function toReviews(raw: unknown): ProductReview[] | undefined {
  if (!Array.isArray(raw) || !raw.length) return undefined;
  return raw.map((item, i) => {
    const r = asRecord(item) ?? {};
    return {
      id: asString(pick(r, ["id", "_id"]), `rev-${i}`),
      author: asString(pick(r, ["author", "name", "user", "username", "reviewer"]), "Guest"),
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
 * Map one loose ecommerce row (SQL / NoSQL / Shopify / Woo / Magento / GraphQL)
 * into Orva Product. Unknown extra columns are ignored.
 */
export function normalizeProduct(raw: unknown, index = 0, storeId = "store-main"): Product {
  const row = flattenPlatformProduct(raw);
  const name = asString(
    pick(row, ["name", "title", "product_name", "productName", "label", "productTitle"]),
    `Product ${index + 1}`,
  );
  const id = asString(
    pick(row, ["id", "_id", "product_id", "productId", "sku", "uuid", "gid"]),
    `p-${index}`,
  );
  const price = asNumber(
    pick(row, [
      "price",
      "amount",
      "sale_price",
      "salePrice",
      "unit_price",
      "unitPrice",
      "cost",
      "price_amount",
      "final_price",
      "variants.0.price",
      "priceRange.minVariantPrice.amount",
    ]),
    0,
  );
  const compareAt = pick(row, [
    "compareAtPrice",
    "compare_at_price",
    "mrp",
    "regular_price",
    "regularPrice",
    "list_price",
    "listPrice",
    "msrp",
    "variants.0.compare_at_price",
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
      "picture",
      "cover",
      "images.0",
      "images.0.src",
      "images.0.url",
      "media.0.url",
      "media.0.src",
      "image.src",
    ]),
    "",
  );
  const galleryRaw = pick(row, ["gallery", "images", "photos", "media", "imageUrls"]);
  let gallery: string[] | undefined;
  if (Array.isArray(galleryRaw)) {
    gallery = galleryRaw
      .map((g) => {
        if (typeof g === "string") return g;
        const r = asRecord(g);
        return r ? asString(pick(r, ["url", "src", "image", "path", "originalSrc", "secure_url"])) : "";
      })
      .filter(Boolean);
  }

  const category = toCategory(
    pick(row, [
      "category",
      "category_name",
      "categoryName",
      "type",
      "collection",
      "product_type",
      "productType",
      "department",
      "categories.0.name",
    ]),
  );
  const stockVal = pick(row, [
    "stock",
    "inventory",
    "qty",
    "quantity",
    "stock_qty",
    "stockQuantity",
    "stock_quantity",
    "inventory_quantity",
    "inventoryQuantity",
  ]);

  const colors = asStringArray(
    pick(row, ["colors", "color", "colour", "Colour", "options.Color", "options.Colour"]),
  );
  const sizes = asStringArray(pick(row, ["sizes", "size", "Size", "options.Size"]));

  return {
    id: id.includes("/") ? id.split("/").pop() || id : id,
    slug: asString(pick(row, ["slug", "handle", "permalink", "url_key", "seo_url"]), slugify(name)),
    sku: asString(pick(row, ["sku", "SKU", "code", "barcode", "gtin"]), `SKU-${id}`),
    name,
    brand: asString(pick(row, ["brand", "vendor", "manufacturer", "store_name", "seller", "maker"])) || undefined,
    price,
    compareAtPrice: compareAt == null ? null : asNumber(compareAt),
    currency: asString(pick(row, ["currency", "currency_code", "currencyCode"]), "INR"),
    rating: asNumber(pick(row, ["rating", "avg_rating", "averageRating", "stars", "average_rating"]), 4.5),
    reviewCount: asNumber(
      pick(row, ["reviewCount", "review_count", "reviews_count", "num_reviews", "rating_count"]),
      0,
    ),
    reviews: toReviews(pick(row, ["reviews", "ratings"])),
    colors: colors.length ? colors : ["Default"],
    sizes: sizes.length ? sizes : ["One Size"],
    shelfIndex: asNumber(pick(row, ["shelfIndex", "shelf_index", "position", "sort", "sort_order", "menu_order"]), index),
    storeId: asString(pick(row, ["storeId", "store_id", "shop_id", "vendor_id", "seller_id"]), storeId),
    category,
    subcategory: asString(
      pick(row, ["subcategory", "sub_category", "subCategory", "department", "aisle", "product_type"]),
      category,
    ),
    image: image || `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80`,
    gallery,
    description: asString(
      pick(row, ["description", "desc", "body", "body_html", "bodyHtml", "details", "summary", "short_description", "content"]),
      name,
    ),
    tags: asStringArray(pick(row, ["tags", "keywords", "labels"])) || undefined,
    badges: toBadges(pick(row, ["badges", "badge", "labels", "flags", "status"])),
    stock: stockVal == null ? null : asNumber(stockVal),
    shippingNote: asString(pick(row, ["shippingNote", "shipping", "delivery", "shipping_class"])) || undefined,
    returnNote: asString(pick(row, ["returnNote", "returns", "return_policy"])) || undefined,
    updatedAt: asString(
      pick(row, ["updatedAt", "updated_at", "modified", "updated_at_timestamp", "date_modified"]),
      new Date().toISOString(),
    ),
  };
}

function normalizeStore(raw: unknown, index = 0, floor = 0): StoreNode {
  const row = asRecord(raw) ?? {};
  const name = asString(pick(row, ["name", "title", "store_name", "shop", "vendor"]), `Store ${index + 1}`);
  const id = asString(pick(row, ["id", "_id", "store_id", "shop_id"]), `store-${index}`);
  const productsRaw = pick(row, ["products", "items", "catalog", "entries"]);
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
      pick(row, ["doorImage", "door_image", "image", "cover", "banner", "logo"]),
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

/** Merge company / site config from any alias shape */
export function mergeConfig(raw: unknown, dataSource: MallSiteConfig["dataSource"]): MallSiteConfig {
  const row = asRecord(raw) ?? {};
  const flags = asRecord(pick(row, ["featureFlags", "features"])) ?? {};
  const themeRaw = asRecord(pick(row, ["theme", "colors", "branding", "brandColors", "palette"])) ?? {};
  const baseTheme = defaultSiteConfig.theme!;
  const theme = {
    brand: asString(
      pick(themeRaw, ["brand", "primary", "primaryColor", "brandColor", "main"]) ??
        pick(row, ["primaryColor", "brandColor", "primary_color", "theme_color"]),
      baseTheme.brand,
    ),
    brandDeep: asString(
      pick(themeRaw, ["brandDeep", "primaryDark", "brand_deep", "dark"]),
      baseTheme.brandDeep ?? baseTheme.brand,
    ),
    accent: asString(
      pick(themeRaw, ["accent", "secondary", "accentColor"]) ?? pick(row, ["accentColor", "accent_color"]),
      baseTheme.accent,
    ),
    accent2: asString(pick(themeRaw, ["accent2", "highlight", "sale", "danger"]), baseTheme.accent2 ?? "#ff3d5a"),
    bg: asString(pick(themeRaw, ["bg", "background", "surface"]), baseTheme.bg ?? "#f1f5f8"),
    ink: asString(pick(themeRaw, ["ink", "text", "foreground"]), baseTheme.ink ?? "#07111f"),
  };

  return {
    ...defaultSiteConfig,
    brandName: asString(
      pick(row, ["brandName", "brand", "name", "store_name", "company", "shopName", "storeName", "title"]),
      defaultSiteConfig.brandName,
    ),
    tagline: asString(
      pick(row, ["tagline", "subtitle", "tag_line", "slogan", "description", "tagLine"]),
      defaultSiteConfig.tagline,
    ),
    currency: asString(pick(row, ["currency", "currency_code", "currencyCode"]), defaultSiteConfig.currency),
    locale: asString(pick(row, ["locale", "lang", "language"]), defaultSiteConfig.locale),
    supportEmail: asString(
      pick(row, ["supportEmail", "email", "support_email", "contactEmail", "customer_email"]),
      defaultSiteConfig.supportEmail,
    ),
    logoUrl:
      asString(pick(row, ["logoUrl", "logo", "logo_url", "logoSrc", "brandLogo", "logo_src", "icon_url"]), "") ||
      defaultSiteConfig.logoUrl,
    faviconUrl:
      asString(pick(row, ["faviconUrl", "favicon", "favicon_url", "icon", "site_icon"]), "") ||
      defaultSiteConfig.faviconUrl,
    couponCode:
      asString(pick(row, ["couponCode", "coupon", "promoCode", "promo_code", "discount_code"]), "") ||
      defaultSiteConfig.couponCode,
    theme,
    trustPoints: asStringArray(pick(row, ["trustPoints", "trust", "guarantees", "benefits"])).length
      ? asStringArray(pick(row, ["trustPoints", "trust", "guarantees", "benefits"]))
      : defaultSiteConfig.trustPoints,
    featureFlags: {
      ...defaultSiteConfig.featureFlags,
      explore: flags.explore !== false,
      shop: flags.shop !== false,
      directory: flags.directory !== false,
      wishlist: flags.wishlist !== false,
      reviews: flags.reviews !== false,
      coupons: flags.coupons !== false,
      guestCheckout: flags.guestCheckout !== false,
    },
    dataSource,
  };
}

/**
 * Accept ANY common ecommerce dump and produce CatalogPayload.
 * Shopify, WooCommerce, Magento, GraphQL edges, SQL rows, Mongo docs,
 * custom REST — all normalized into a runnable storefront catalog.
 */
export function normalizeCatalog(
  input: unknown,
  dataSource: MallSiteConfig["dataSource"] = "api",
): CatalogPayload {
  const unwrapped = unwrapEcommercePayload(input);

  if (unwrapped.floors?.length) {
    const root = asRecord(input);
    return {
      config: mergeConfig(unwrapped.config ?? root?.config, dataSource),
      floors: unwrapped.floors as MallFloor[],
      generatedAt: unwrapped.generatedAt || asString(root?.generatedAt, new Date().toISOString()),
    };
  }

  let products: Product[] = [];
  let stores: StoreNode[] | null = null;

  if (unwrapped.stores?.length) {
    stores = unwrapped.stores.map((s, i) => normalizeStore(s, i));
    products = stores.flatMap((s) => s.products);
  } else if (unwrapped.products.length) {
    products = unwrapped.products.map((p, i) => normalizeProduct(p, i));
  } else if (Array.isArray(input)) {
    products = input.map((p, i) => normalizeProduct(p, i));
  }

  const floors = stores
    ? productsToFloors(
        stores.flatMap((s) => s.products.map((p) => ({ ...p, storeId: s.id, brand: p.brand || s.name }))),
      )
    : productsToFloors(products);

  return {
    config: mergeConfig(unwrapped.config, dataSource),
    floors,
    generatedAt: unwrapped.generatedAt || new Date().toISOString(),
  };
}
