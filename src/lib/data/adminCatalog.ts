import { loadCatalog, flattenProducts, invalidateCatalogCache } from "@/lib/data/repository";
import { writeLiveCatalog } from "@/lib/data/connectors/jsonFile";
import { slugifyPath } from "@/lib/catalog";
import type { MallFloor, MallSiteConfig, Product } from "@/types/mall";
import type { MallCategory } from "@/types/mall";

export type ProductInput = {
  id?: string;
  name: string;
  price: number;
  compareAtPrice?: number | null;
  currency?: string;
  category?: MallCategory;
  subcategory?: string;
  brand?: string;
  storeId?: string;
  description?: string;
  image?: string;
  gallery?: string[];
  stock?: number | null;
  colors?: string[];
  sizes?: string[];
  badges?: Product["badges"];
  sku?: string;
  slug?: string;
  rating?: number;
  shippingNote?: string;
  returnNote?: string;
};

function deepCloneFloors(floors: MallFloor[]): MallFloor[] {
  return JSON.parse(JSON.stringify(floors)) as MallFloor[];
}

function findDefaultStore(floors: MallFloor[], category?: string, storeId?: string) {
  if (storeId) {
    for (const f of floors) {
      const s = f.stores.find((x) => x.id === storeId);
      if (s) return s;
    }
  }
  if (category) {
    for (const f of floors) {
      const s = f.stores.find((x) => x.category === category);
      if (s) return s;
    }
  }
  return floors[0]?.stores[0] ?? null;
}

function toProduct(input: ProductInput, storeId: string, currency: string): Product {
  const id = input.id || `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  const name = input.name.trim();
  return {
    id,
    slug: input.slug || slugifyPath(name) || id,
    sku: input.sku || `SKU-${id.slice(-6).toUpperCase()}`,
    name,
    brand: input.brand,
    price: Number(input.price) || 0,
    compareAtPrice: input.compareAtPrice ?? null,
    currency: input.currency || currency,
    rating: input.rating ?? 4.6,
    reviewCount: 0,
    colors: input.colors?.length ? input.colors : ["Default"],
    sizes: input.sizes?.length ? input.sizes : ["One size"],
    shelfIndex: 0,
    storeId,
    category: (input.category as MallCategory) || "fashion",
    subcategory: input.subcategory || "General",
    image:
      input.image ||
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=720&h=900&q=90",
    gallery: input.gallery,
    description: input.description || `${name} — managed from Orva Admin.`,
    badges: input.badges,
    stock: input.stock ?? 25,
    shippingNote: input.shippingNote,
    returnNote: input.returnNote,
    updatedAt: new Date().toISOString(),
  };
}

async function persist(floors: MallFloor[], config: MallSiteConfig) {
  const result = await writeLiveCatalog({
    floors,
    config: { ...config, dataSource: "json" },
    generatedAt: new Date().toISOString(),
  });
  invalidateCatalogCache();
  return result;
}

export async function adminListProducts() {
  const payload = await loadCatalog(true);
  return {
    products: flattenProducts(payload.floors),
    floors: payload.floors,
    config: payload.config,
    stores: payload.floors.flatMap((f) =>
      f.stores.map((s) => ({
        id: s.id,
        name: s.name,
        category: s.category,
        floor: f.label,
      })),
    ),
  };
}

export async function adminUpsertProduct(input: ProductInput) {
  const payload = await loadCatalog(true);
  const floors = deepCloneFloors(payload.floors);
  const currency = payload.config.currency || "INR";

  // Remove existing if updating
  if (input.id) {
    for (const f of floors) {
      for (const s of f.stores) {
        s.products = s.products.filter((p) => p.id !== input.id);
      }
    }
  }

  const store = findDefaultStore(floors, input.category, input.storeId);
  if (!store) throw new Error("No boutique available to attach this product.");

  const product = toProduct({ ...input, storeId: store.id }, store.id, currency);
  // Re-find store in cloned tree
  for (const f of floors) {
    const s = f.stores.find((x) => x.id === store.id);
    if (s) {
      s.products = [product, ...s.products];
      break;
    }
  }

  const result = await persist(floors, payload.config);
  return { product, path: result.path, generatedAt: result.payload.generatedAt };
}

export async function adminDeleteProduct(id: string) {
  const payload = await loadCatalog(true);
  const floors = deepCloneFloors(payload.floors);
  let removed = false;
  for (const f of floors) {
    for (const s of f.stores) {
      const before = s.products.length;
      s.products = s.products.filter((p) => p.id !== id);
      if (s.products.length < before) removed = true;
    }
  }
  if (!removed) throw new Error("Product not found");
  const result = await persist(floors, payload.config);
  return { ok: true, path: result.path, generatedAt: result.payload.generatedAt };
}
