/**
 * Universal ecommerce schema adapters.
 * Flattens Shopify / WooCommerce / Magento / GraphQL / custom dumps
 * into rows that normalizeProduct understands.
 */

type Loose = Record<string, unknown>;

function asRecord(v: unknown): Loose | null {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Loose) : null;
}

/** Dig into objects + array indexes: "data.products.edges.0.node" */
export function dig(root: unknown, path: string): unknown {
  if (!path.trim()) return root;
  let cur: unknown = root;
  for (const part of path.split(".").filter(Boolean)) {
    if (cur == null) return undefined;
    if (Array.isArray(cur)) {
      const idx = Number(part);
      if (!Number.isFinite(idx)) return undefined;
      cur = cur[idx];
      continue;
    }
    const r = asRecord(cur);
    if (!r) return undefined;
    cur = r[part];
  }
  return cur;
}

function asString(v: unknown, fallback = ""): string {
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return fallback;
}

function moneyValue(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v.replace(/[^0-9.-]/g, ""));
    return Number.isFinite(n) ? n : undefined;
  }
  const r = asRecord(v);
  if (!r) return undefined;
  const amount = r.amount ?? r.value ?? r.price ?? r.centAmount;
  if (typeof amount === "number" && r.centAmount != null) {
    return amount / 100;
  }
  if (typeof amount === "number") return amount;
  if (typeof amount === "string") {
    const n = Number(amount.replace(/[^0-9.-]/g, ""));
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

function imageUrl(v: unknown): string {
  if (typeof v === "string") return v;
  const r = asRecord(v);
  if (!r) return "";
  return asString(r.src ?? r.url ?? r.href ?? r.path ?? r.originalSrc ?? r.original_src ?? r.secure_url);
}

/** Unwrap GraphQL connection { edges: [{ node }] } or { nodes: [] } */
function unwrapConnection(v: unknown): unknown[] {
  if (Array.isArray(v)) {
    if (v.length) {
      const first = asRecord(v[0]);
      if (first && ("node" in first || "item" in first)) {
        return v
          .map((e) => {
            const edge = asRecord(e);
            return edge?.node ?? edge?.item ?? e;
          })
          .filter((x) => x != null);
      }
    }
    return v;
  }
  const r = asRecord(v);
  if (!r) return [];
  if (Array.isArray(r.nodes)) return r.nodes;
  if (Array.isArray(r.edges)) {
    return r.edges
      .map((e) => {
        const edge = asRecord(e);
        return edge?.node ?? edge?.item ?? e;
      })
      .filter((x) => x != null);
  }
  if (Array.isArray(r.items)) return r.items;
  if (Array.isArray(r.results)) return r.results;
  return [];
}

/**
 * Optional env remap: MALL_FIELD_MAP='{"title":"name","unit_cost":"price"}'
 * Maps company column names → Orva product fields before normalize.
 */
export function applyEnvFieldMap(row: Loose): Loose {
  const raw = process.env.MALL_FIELD_MAP;
  if (!raw?.trim()) return row;
  try {
    const map = JSON.parse(raw) as Record<string, string>;
    const out: Loose = { ...row };
    for (const [from, to] of Object.entries(map)) {
      if (!to) continue;
      const val = from.includes(".") ? dig(row, from) : row[from];
      if (val !== undefined && val !== null && val !== "" && out[to] == null) {
        out[to] = val;
      }
    }
    return out;
  } catch {
    return row;
  }
}

/** Magento custom_attributes → flat keys */
function flattenMagentoAttrs(row: Loose): Loose {
  const attrs = row.custom_attributes;
  if (!Array.isArray(attrs)) return row;
  const out: Loose = { ...row };
  for (const item of attrs) {
    const a = asRecord(item);
    if (!a) continue;
    const code = asString(a.attribute_code ?? a.code);
    if (code && out[code] == null) out[code] = a.value;
  }
  const stock = asRecord(asRecord(row.extension_attributes)?.stock_item);
  if (stock && out.stock == null) {
    out.stock = stock.qty ?? stock.quantity;
  }
  return out;
}

/** WooCommerce attributes → colors/sizes */
function flattenWooAttrs(row: Loose): Loose {
  const attrs = row.attributes;
  if (!Array.isArray(attrs)) return row;
  const out: Loose = { ...row };
  const colors: string[] = [];
  const sizes: string[] = [];
  for (const item of attrs) {
    const a = asRecord(item);
    if (!a) continue;
    const name = asString(a.name ?? a.slug).toLowerCase();
    const options = Array.isArray(a.options)
      ? a.options.map((o) => asString(o)).filter(Boolean)
      : asString(a.option)
        ? [asString(a.option)]
        : [];
    if (name.includes("color") || name.includes("colour")) colors.push(...options);
    else if (name.includes("size")) sizes.push(...options);
  }
  if (colors.length && !out.colors) out.colors = colors;
  if (sizes.length && !out.sizes) out.sizes = sizes;
  return out;
}

/**
 * Flatten one platform product (Shopify / Woo / Magento / generic)
 * into a flat alias-friendly row.
 */
export function flattenPlatformProduct(raw: unknown): Loose {
  let row = asRecord(raw) ?? {};

  // GraphQL node already unwrapped by caller, but handle nested connections
  row = flattenMagentoAttrs(row);
  row = flattenWooAttrs(row);

  const out: Loose = { ...row };

  // Shopify REST / Admin: variants[0].price
  const variants = unwrapConnection(row.variants);
  const firstVariant = asRecord(variants[0]) ?? {};
  if (out.price == null || out.price === "") {
    const p =
      moneyValue(firstVariant.price) ??
      moneyValue(firstVariant.priceV2) ??
      moneyValue(asRecord(firstVariant.priceV2)?.amount) ??
      moneyValue(dig(row, "priceRange.minVariantPrice")) ??
      moneyValue(dig(row, "priceRange.minVariantPrice.amount")) ??
      moneyValue(row.sale_price) ??
      moneyValue(row.regular_price);
    if (p != null) out.price = p;
  }
  if (out.compareAtPrice == null && out.compare_at_price == null) {
    const c =
      moneyValue(firstVariant.compare_at_price) ??
      moneyValue(firstVariant.compareAtPrice) ??
      moneyValue(row.regular_price) ??
      moneyValue(row.compare_at_price);
    if (c != null) out.compareAtPrice = c;
  }
  if (!out.sku && firstVariant.sku) out.sku = firstVariant.sku;
  if (out.stock == null && (firstVariant.inventory_quantity != null || firstVariant.inventoryQuantity != null)) {
    out.stock = firstVariant.inventory_quantity ?? firstVariant.inventoryQuantity;
  }

  // Images: Shopify image object, images[].src, featuredImage
  if (!out.image || typeof out.image === "object") {
    const img =
      imageUrl(row.image) ||
      imageUrl(row.featuredImage) ||
      imageUrl(row.featured_image) ||
      imageUrl(unwrapConnection(row.images)[0]) ||
      imageUrl(unwrapConnection(row.media)[0]) ||
      imageUrl(dig(row, "images.0")) ||
      imageUrl(dig(row, "images.edges.0.node"));
    if (img) out.image = img;
  }

  const gallerySrc = unwrapConnection(row.images).length
    ? unwrapConnection(row.images)
    : unwrapConnection(row.media);
  if (gallerySrc.length) {
    out.gallery = gallerySrc.map(imageUrl).filter(Boolean);
  }

  // Categories: Woo [{name}], Magento categories array, Shopify product_type
  if (!out.category) {
    const cats = row.categories ?? row.category_ids ?? row.collections;
    if (Array.isArray(cats) && cats.length) {
      const first = cats[0];
      out.category = typeof first === "string" ? first : asString(asRecord(first)?.name ?? asRecord(first)?.title);
    } else if (row.product_type) {
      out.category = row.product_type;
    } else if (row.productType) {
      out.category = row.productType;
    }
  }

  // Description
  if (!out.description) {
    out.description =
      row.body_html ?? row.bodyHtml ?? row.descriptionHtml ?? row.short_description ?? row.description;
  }

  // Tags string "a, b" (Shopify)
  if (typeof row.tags === "string" && !Array.isArray(out.tags)) {
    out.tags = row.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }

  // Title aliases already in pick; ensure name
  if (!out.name && row.title) out.name = row.title;

  return applyEnvFieldMap(out);
}

type Unwrapped = {
  products: unknown[];
  stores: unknown[] | null;
  config: unknown;
  floors: unknown[] | null;
  generatedAt?: string;
};

function firstArray(...candidates: unknown[]): unknown[] | null {
  for (const c of candidates) {
    if (Array.isArray(c) && c.length) return c;
    const conn = unwrapConnection(c);
    if (conn.length) return conn;
  }
  return null;
}

/**
 * Pull products / stores / config out of ANY common ecommerce API envelope.
 * Honors MALL_RESPONSE_PATH (e.g. "data.items" or "payload.catalog.products").
 */
export function unwrapEcommercePayload(input: unknown): Unwrapped {
  if (Array.isArray(input)) {
    return { products: input, stores: null, config: undefined, floors: null };
  }

  const root = asRecord(input);
  if (!root) {
    return { products: [], stores: null, config: undefined, floors: null };
  }

  if (Array.isArray(root.floors)) {
    return {
      products: [],
      stores: null,
      config: root.config ?? root.settings ?? root.site ?? root.store,
      floors: root.floors,
      generatedAt: asString(root.generatedAt || root.updated_at) || undefined,
    };
  }

  // Custom response path from env
  const pathEnv = process.env.MALL_RESPONSE_PATH?.trim();
  if (pathEnv) {
    const dug = dig(root, pathEnv);
    if (Array.isArray(dug)) {
      return {
        products: dug,
        stores: null,
        config: root.config ?? root.settings ?? root.site ?? dig(root, "data.config"),
        floors: null,
        generatedAt: asString(root.generatedAt) || undefined,
      };
    }
    const dugRec = asRecord(dug);
    if (dugRec) {
      const list =
        firstArray(dugRec.products, dugRec.items, dugRec.rows, dugRec.documents, dugRec.results, dugRec.nodes) ??
        unwrapConnection(dugRec);
      if (list.length) {
        return {
          products: list,
          stores: null,
          config: root.config ?? dugRec.config,
          floors: null,
        };
      }
    }
  }

  const data = asRecord(root.data) ?? asRecord(root.payload) ?? asRecord(root.result) ?? asRecord(root.response);

  const storeList = firstArray(root.stores, root.shops, root.vendors, root.boutiques, data?.stores);
  if (storeList?.length) {
    return {
      products: [],
      stores: storeList,
      config: root.config ?? root.settings ?? root.site ?? data?.config,
      floors: null,
      generatedAt: asString(root.generatedAt) || undefined,
    };
  }

  const products =
    firstArray(
      root.products,
      root.items,
      root.rows,
      root.documents,
      root.results,
      root.catalog,
      root.Entries,
      root.entry,
      data?.products,
      data?.items,
      data?.rows,
      data?.documents,
      data?.results,
      data?.catalog,
      unwrapConnection(root.products),
      unwrapConnection(data?.products),
      unwrapConnection(dig(root, "data.products")),
      unwrapConnection(dig(root, "data.products.edges")),
      (() => unwrapConnection(dig(root, "data.products")))(),
    ) ?? [];

  return {
    products,
    stores: null,
    config: root.config ?? root.settings ?? root.site ?? root.shop ?? root.branding ?? data?.config ?? data?.shop,
    floors: null,
    generatedAt: asString(root.generatedAt || root.updated_at || root.timestamp) || undefined,
  };
}

/** Detect which schema family a payload looks like (for admin/status messages) */
export function detectSchemaFamily(input: unknown): string {
  const root = asRecord(input);
  if (Array.isArray(input)) {
    const first = asRecord(input[0]);
    if (first?.regular_price != null || first?.sale_price != null) return "woocommerce";
    if (first?.variants != null || first?.body_html != null) return "shopify";
    if (Array.isArray(first?.custom_attributes)) return "magento";
    return "array";
  }
  if (!root) return "empty";
  if (Array.isArray(root.floors)) return "orva";
  if (dig(root, "data.products.edges") || dig(root, "data.products.nodes")) return "shopify-graphql";
  if (Array.isArray(root.products) && asRecord(root.products[0])?.variants) return "shopify";
  if (Array.isArray(root.items) && asRecord(root.items[0])?.custom_attributes) return "magento";
  if (Array.isArray(root.documents)) return "mongodb";
  if (Array.isArray(root.rows) || Array.isArray(root.data)) return "sql-rest";
  if (Array.isArray(root.products) || Array.isArray(root.items)) return "generic-products";
  return "unknown";
}
