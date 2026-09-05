export type MallCategory =
  | "fashion"
  | "beauty"
  | "electronics"
  | "sports"
  | "home"
  | "luxury"
  | "food"
  | "gaming";

export type Product = {
  id: string;
  name: string;
  price: number;
  rating: number;
  colors: string[];
  sizes: string[];
  shelfIndex: number;
  storeId: string;
  category: MallCategory;
  subcategory: string;
  image: string;
  description: string;
};

export type StoreNode = {
  id: string;
  name: string;
  category: MallCategory;
  /** Subcategory that matches this floor’s main category family */
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
};

export type MallFloor = {
  id: string;
  level: number;
  label: string;
  /** Nice floor display name */
  title: string;
  /** Main floor category family shown on landing + lobby */
  categoryName: string;
  /** Unique subcategory labels on this floor */
  subcategories: string[];
  stores: StoreNode[];
};
