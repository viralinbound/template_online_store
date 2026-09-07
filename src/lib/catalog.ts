import type { MallFloor, Product } from "@/types/mall";
import { mallFloors as staticFloors } from "@/data/mallData";
import type { MallCategory } from "@/types/mall";

/** Optional floors arg = database-ready; defaults keep sync imports working */
function floorsOrDefault(floors?: MallFloor[]) {
  return floors ?? staticFloors;
}

export function allProducts(floors?: MallFloor[]): Product[] {
  return floorsOrDefault(floors).flatMap((f) => f.stores.flatMap((s) => s.products));
}

export function allStores(floors?: MallFloor[]) {
  return floorsOrDefault(floors).flatMap((f, floorIndex) =>
    f.stores.map((store) => ({
      store,
      floorLabel: f.label,
      floorTitle: f.title,
      floorIndex,
    })),
  );
}

export function searchProducts(query: string, limit = 24, floors?: MallFloor[]): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const pool = allProducts(floors);
  const scored = pool
    .map((p) => {
      const hay = `${p.name} ${p.brand ?? ""} ${p.category} ${p.subcategory} ${p.description} ${(p.tags ?? []).join(" ")}`.toLowerCase();
      let score = 0;
      if (p.name.toLowerCase().includes(q)) score += 5;
      if (hay.includes(q)) score += 2;
      q.split(/\s+/).forEach((w) => {
        if (hay.includes(w)) score += 1;
      });
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.p.rating - a.p.rating);
  const seen = new Set<string>();
  const out: Product[] = [];
  for (const { p } of scored) {
    const base = p.name.split(" · ")[0] ?? p.name;
    if (seen.has(base)) continue;
    seen.add(base);
    out.push(p);
    if (out.length >= limit) break;
  }
  return out;
}

export function relatedProducts(product: Product, limit = 4, floors?: MallFloor[]): Product[] {
  const pool = allProducts(floors).filter((p) => p.id !== product.id);
  const sameStore = pool.filter((p) => p.storeId === product.storeId);
  const sameCat = pool.filter(
    (p) => p.category === product.category && p.storeId !== product.storeId,
  );
  const merged = [...sameStore, ...sameCat, ...pool];
  const seen = new Set<string>();
  const out: Product[] = [];
  for (const p of merged) {
    if (seen.has(p.id)) continue;
    seen.add(p.id);
    out.push(p);
    if (out.length >= limit) break;
  }
  return out;
}

export function suggestProducts(limit = 4, excludeIds: string[] = [], floors?: MallFloor[]): Product[] {
  const ban = new Set(excludeIds);
  const pool = allProducts(floors)
    .filter((p) => !ban.has(p.id))
    .sort((a, b) => b.rating - a.rating || b.price - a.price);
  const seen = new Set<string>();
  const out: Product[] = [];
  for (const p of pool) {
    const base = p.name.split(" · ")[0] ?? p.name;
    if (seen.has(base)) continue;
    seen.add(base);
    out.push(p);
    if (out.length >= limit) break;
  }
  return out;
}

export type ShopSort = "featured" | "price-asc" | "price-desc" | "rating" | "newest";

export type ShopFilters = {
  category: MallCategory | "all";
  minPrice: number;
  maxPrice: number;
  minRating: number;
  sort: ShopSort;
  inStockOnly?: boolean;
};

export function filterShopProducts(
  filters: ShopFilters,
  limit = 48,
  floors?: MallFloor[],
): Product[] {
  let pool = allProducts(floors);
  if (filters.category !== "all") {
    pool = pool.filter((p) => p.category === filters.category);
  }
  pool = pool.filter(
    (p) =>
      p.price >= filters.minPrice &&
      p.price <= filters.maxPrice &&
      p.rating >= filters.minRating,
  );
  if (filters.inStockOnly) {
    pool = pool.filter((p) => p.stock == null || p.stock > 0);
  }

  switch (filters.sort) {
    case "price-asc":
      pool = [...pool].sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      pool = [...pool].sort((a, b) => b.price - a.price);
      break;
    case "rating":
      pool = [...pool].sort((a, b) => b.rating - a.rating);
      break;
    case "newest":
      pool = [...pool].sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""));
      break;
    default:
      pool = [...pool].sort((a, b) => b.rating - a.rating || b.price - a.price);
  }

  const seen = new Set<string>();
  const out: Product[] = [];
  for (const p of pool) {
    const base = p.name.split(" · ")[0] ?? p.name;
    if (seen.has(base)) continue;
    seen.add(base);
    out.push(p);
    if (out.length >= limit) break;
  }
  return out;
}

export function productsByCategory(
  category: MallCategory | "all",
  limit = 24,
  floors?: MallFloor[],
): Product[] {
  return filterShopProducts(
    { category, minPrice: 0, maxPrice: 1_000_000, minRating: 0, sort: "featured" },
    limit,
    floors,
  );
}

export function storeById(id: string, floors?: MallFloor[]) {
  return allStores(floors).find((x) => x.store.id === id) ?? null;
}

export function slugifyPath(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export function floorSlug(floor: MallFloor): string {
  return floor.id || slugifyPath(floor.title);
}

export function findFloorBySlug(slug: string, floors?: MallFloor[]) {
  const list = floorsOrDefault(floors);
  return (
    list.find((f) => floorSlug(f) === slug || f.id === slug || slugifyPath(f.title) === slug) ?? null
  );
}

export function findStoreBySlug(slug: string, floors?: MallFloor[]) {
  return (
    allStores(floors).find(
      (x) => x.store.slug === slug || x.store.id === slug || slugifyPath(x.store.name) === slug,
    ) ?? null
  );
}

export function findProductBySlug(slug: string, floors?: MallFloor[]) {
  const pool = allProducts(floors);
  return (
    pool.find((p) => p.slug === slug || p.id === slug || slugifyPath(p.name) === slug) ?? null
  );
}

export function productHref(p: { slug: string; id: string }) {
  return `/product/${p.slug || p.id}`;
}

export function storeHref(s: { slug: string; id: string }) {
  return `/stores/${s.slug || s.id}`;
}

/** Map a selected color to gallery/image so cards & 3D update live */
export function mediaForColor(product: Product, color?: string | null): string {
  const gallery = product.gallery?.length ? product.gallery : [product.image];
  if (!color || !product.colors.length) return gallery[0] ?? product.image;
  const idx = Math.max(0, product.colors.indexOf(color));
  return gallery[idx % gallery.length] ?? product.image;
}

export const LANDING_CHIPS = [
  { label: "Fashion", floorHint: "G", category: "fashion" as MallCategory },
  { label: "Beauty", floorHint: "G", category: "beauty" as MallCategory },
  { label: "Electronics", floorHint: "02", category: "electronics" as MallCategory },
  { label: "Home", floorHint: "03", category: "home" as MallCategory },
  { label: "Luxury", floorHint: "04", category: "luxury" as MallCategory },
  { label: "Gaming", floorHint: "05", category: "gaming" as MallCategory },
] as const;

export const SHOP_CATEGORIES: { id: MallCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "fashion", label: "Fashion" },
  { id: "beauty", label: "Beauty" },
  { id: "electronics", label: "Electronics" },
  { id: "sports", label: "Sports" },
  { id: "home", label: "Home" },
  { id: "luxury", label: "Luxury" },
  { id: "food", label: "Café" },
  { id: "gaming", label: "Gaming" },
];

export const HELP_SECTIONS = [
  {
    id: "shipping",
    title: "Shipping",
    body: [
      "Standard delivery: 2–4 days (demo).",
      "Express option available at checkout for a small fee (demo).",
      "You will see delivery notes on every product page.",
    ],
  },
  {
    id: "returns",
    title: "Returns",
    body: [
      "Easy returns within 7 days on unused items (demo policy).",
      "Start a return from Orders after you place a purchase.",
      "Boutique partners follow Orva return guidelines.",
    ],
  },
  {
    id: "faq",
    title: "FAQ",
    body: [
      "Shop = fast catalog. Mall = scroll floor layouts and enter each level.",
      "Directory lists every floor and boutique in one place.",
      "Guest checkout is on — buy without an account, or sign in to save history (demo).",
      "Use code ORVA10 / ORVAFRIEND for demo discounts.",
      "Connect your SQL or NoSQL database — the UI adopts your catalog automatically.",
    ],
  },
  {
    id: "about",
    title: "About Orva",
    body: [
      "Orva is a modern ecommerce platform: fast shop, visual explore, and a full checkout flow.",
      "Built to feel premium for customers and ready for your real product database.",
    ],
  },
  {
    id: "whats-next",
    title: "What’s next",
    body: [
      "Meal kits & café combos — bundle SKUs with one Buy.",
      "Food Court mood filters (calm / rush / kids / late-night).",
      "Pickup slots and table-for-two demo UI on food pages.",
      "Gift + food hampers for seasonal edits.",
      "Live kitchen status from stock & shipping notes.",
      "Compare desserts with mini 3D spins — then AR tray later.",
    ],
  },
] as const;

export const EXPERIENCE_ROADMAP = [
  {
    title: "Meal kits & café combos",
    body: "Bundle coffee + pastry (or kit + mug) into one Buy for the Food Court.",
  },
  {
    title: "Mood filters",
    body: "Calm, rush, kids, late-night — filter the court by how you want to feel.",
  },
  {
    title: "Pickup slots",
    body: "Demo table-for-two / pickup windows on food product pages.",
  },
  {
    title: "Gift hampers",
    body: "Seasonal food + lifestyle edits with one cart path.",
  },
  {
    title: "Live kitchen status",
    body: "Surface stock and shipping notes as “kitchen open” style badges.",
  },
  {
    title: "Compare desserts",
    body: "Use mini 3D spins side-by-side before you choose a sweet.",
  },
] as const;

export const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Shop the catalog",
    body: "Filter, tilt cards, quick look — Buy in two taps.",
  },
  {
    step: "02",
    title: "Scroll the mall",
    body: "Ride each floor layout, then enter boutiques on that level.",
  },
  {
    step: "03",
    title: "Checkout clear",
    body: "Guest or signed-in demo path with coupons and tracking.",
  },
] as const;

/** Simple, customer-facing reasons to shop — shown on home */
export const CUSTOMER_PROMISES = [
  {
    title: "Shop in seconds",
    body: "Search, filter, and add to cart like any top online store.",
  },
  {
    title: "See it come alive",
    body: "Explore floors in a light 3D walk — fun, not confusing.",
  },
  {
    title: "Trust every step",
    body: "Clear price, stock, delivery, and easy returns on every product.",
  },
  {
    title: "Save what you love",
    body: "Wishlist, recent views, and coupons keep shopping personal.",
  },
] as const;
