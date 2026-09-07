export type MallCategory =
  | "fashion"
  | "beauty"
  | "electronics"
  | "sports"
  | "home"
  | "luxury"
  | "food"
  | "gaming";

/** Promo / status chips — UI only renders badges present on the product */
export type ProductBadge = "new" | "sale" | "limited" | "bestseller" | "exclusive";

export type ProductReview = {
  id: string;
  author: string;
  rating: number;
  title?: string;
  body: string;
  createdAt: string;
};

/**
 * Product shape mirrors a typical ecommerce DB row.
 * Optional fields let the UI adapt when a connected database
 * omits or later adds columns (gallery, stock, reviews, etc.).
 */
export type Product = {
  id: string;
  /** URL-safe id for future /product/[slug] routes */
  slug: string;
  sku: string;
  name: string;
  brand?: string;
  price: number;
  /** When set and > price, UI shows strikethrough + % off */
  compareAtPrice?: number | null;
  currency: string;
  rating: number;
  reviewCount: number;
  reviews?: ProductReview[];
  colors: string[];
  sizes: string[];
  shelfIndex: number;
  storeId: string;
  category: MallCategory;
  subcategory: string;
  image: string;
  /** Extra images — PDP gallery only when length > 1 */
  gallery?: string[];
  description: string;
  tags?: string[];
  badges?: ProductBadge[];
  /** null/undefined = unlimited (demo); 0 = sold out */
  stock?: number | null;
  shippingNote?: string;
  returnNote?: string;
  updatedAt?: string;
};

export type StoreNode = {
  id: string;
  slug: string;
  name: string;
  category: MallCategory;
  subcategory: string;
  floor: number;
  wing: "north" | "south" | "east" | "west" | "plaza" | "lane" | "court" | "gate";
  theme: {
    primary: string;
    accent: string;
    floor: string;
    wall: string;
  };
  doorImage: string;
  products: Product[];
  description?: string;
  hours?: string;
  featured?: boolean;
};

export type MallFloor = {
  id: string;
  level: number;
  label: string;
  title: string;
  categoryName: string;
  subcategories: string[];
  stores: StoreNode[];
  heroImage?: string;
};

/** Site-wide settings — swap via DB/CMS without redesigning UI */
export type MallFeatureFlags = {
  explore: boolean;
  shop: boolean;
  directory: boolean;
  wishlist: boolean;
  reviews: boolean;
  coupons: boolean;
  guestCheckout: boolean;
};

export type MallSiteTheme = {
  brand: string;
  brandDeep?: string;
  accent: string;
  accent2?: string;
  bg?: string;
  ink?: string;
};

export type MallSiteConfig = {
  brandName: string;
  tagline: string;
  currency: string;
  locale: string;
  supportEmail?: string;
  /** Company logo URL — header / footer mark */
  logoUrl?: string;
  /** Browser tab icon */
  faviconUrl?: string;
  /** Optional coupon code shown in UI (demo) */
  couponCode?: string;
  /** Brand colors applied as CSS variables across the storefront */
  theme?: MallSiteTheme;
  trustPoints: string[];
  featureFlags: MallFeatureFlags;
  /** local | api | database | json | sql | nosql — shown in admin/dev only */
  dataSource: "local" | "api" | "database" | "json" | "sql" | "nosql";
};

export type CatalogPayload = {
  config: MallSiteConfig;
  floors: MallFloor[];
  generatedAt: string;
};
