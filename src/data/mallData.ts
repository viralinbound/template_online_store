import type { MallFloor, MallCategory, Product, StoreNode } from "@/types/mall";
import { categoryCollageImage, productImage, storeDoorImage } from "@/lib/images";

const categoryPools: Record<MallCategory, string[]> = {
  fashion: ["Jacket", "Sneaker", "Denim", "Shirt", "Watch", "Coat", "Hoodie"],
  beauty: ["Serum", "Lipstick", "Perfume", "Mask", "Cleanser", "Cream"],
  electronics: ["Laptop", "Phone", "Tablet", "Camera", "Speaker", "Monitor"],
  sports: ["Trainer", "Football", "Yoga Mat", "Running Shoe", "Bottle", "Jersey"],
  home: ["Sofa", "Lamp", "Chair", "Cookware", "Curtain", "Rug"],
  luxury: ["Designer Bag", "Limited Watch", "Diamond Ring", "Silk Suit", "Fragrance"],
  food: ["Coffee Kit", "Snack Box", "Tea Set", "Cookie Pack", "Juice Mix", "Pastry"],
  gaming: ["Headset", "Controller", "Keyboard", "Console", "Mouse", "Chair"],
};

const themes: Record<MallCategory, StoreNode["theme"]> = {
  fashion: { primary: "#0f4f52", accent: "#14999c", floor: "#f2f8f8", wall: "#d9ecec" },
  beauty: { primary: "#8f3d52", accent: "#e8788a", floor: "#fbf4f6", wall: "#f3e0e6" },
  electronics: { primary: "#1a5578", accent: "#3aa0d8", floor: "#f2f7fb", wall: "#dceaf4" },
  sports: { primary: "#1a5c3d", accent: "#2db87a", floor: "#f2f9f5", wall: "#d8efe4" },
  home: { primary: "#6b5428", accent: "#c9a04a", floor: "#faf7f1", wall: "#efe5d4" },
  luxury: { primary: "#6a5524", accent: "#c4a04a", floor: "#faf7f0", wall: "#efe4cf" },
  food: { primary: "#a34a22", accent: "#e88755", floor: "#fbf5f0", wall: "#f3e2d5" },
  gaming: { primary: "#0f4f52", accent: "#1fb8aa", floor: "#f0f9f7", wall: "#d5eee9" },
};

type FloorStoreSpec = {
  category: MallCategory;
  subcategory: string;
  name: string;
};

type FloorProgram = {
  title: string;
  categoryName: string;
  stores: FloorStoreSpec[];
};

/** Floor category + matching subcategory store names */
const floorPrograms: FloorProgram[] = [
  {
    title: "Ground Atrium",
    categoryName: "Fashion & Food",
    stores: [
      { category: "fashion", subcategory: "Ready-to-Wear", name: "AURA Atelier" },
      { category: "beauty", subcategory: "Beauty Studio", name: "LUMIÉ Glow" },
      { category: "food", subcategory: "Café Court", name: "Café Atrium" },
      { category: "fashion", subcategory: "Street Style", name: "Thread & Co" },
      { category: "beauty", subcategory: "Fragrance Desk", name: "Bloom Lab" },
      { category: "food", subcategory: "Sweet Counter", name: "Bites Court" },
      { category: "fashion", subcategory: "Denim Lane", name: "Indigo Row" },
      { category: "luxury", subcategory: "Gift Boutique", name: "Maison Petit" },
    ],
  },
  {
    title: "Style Runway",
    categoryName: "Style & Sport",
    stores: [
      { category: "fashion", subcategory: "Runway Edit", name: "AURA Runway" },
      { category: "sports", subcategory: "Active Wear", name: "Velocity Gear" },
      { category: "luxury", subcategory: "Premium Tailor", name: "Orélle House" },
      { category: "fashion", subcategory: "Footwear Hub", name: "Step Form" },
      { category: "sports", subcategory: "Training Zone", name: "Field Pro" },
      { category: "beauty", subcategory: "Sport Beauty", name: "Glow Active" },
      { category: "luxury", subcategory: "Accessories", name: "Maison V" },
      { category: "fashion", subcategory: "Casual Wear", name: "Thread Daily" },
    ],
  },
  {
    title: "Tech Pavilion",
    categoryName: "Electronics & Gaming",
    stores: [
      { category: "electronics", subcategory: "Laptops", name: "Nextron Core" },
      { category: "gaming", subcategory: "Game Arena", name: "Neon Arena" },
      { category: "electronics", subcategory: "Mobiles", name: "Pixel Bay" },
      { category: "electronics", subcategory: "Audio Lab", name: "Sound Dock" },
      { category: "gaming", subcategory: "Controllers", name: "Level Up" },
      { category: "electronics", subcategory: "Cameras", name: "Lens Bay" },
      { category: "gaming", subcategory: "Esports Desk", name: "Arena Desk" },
      { category: "electronics", subcategory: "Smart Home", name: "Nextron Home" },
    ],
  },
  {
    title: "Living Loft",
    categoryName: "Home Living",
    stores: [
      { category: "home", subcategory: "Living Room", name: "Haven Lounge" },
      { category: "home", subcategory: "Lighting", name: "Nest Light" },
      { category: "home", subcategory: "Seating", name: "Form Chair" },
      { category: "home", subcategory: "Kitchen", name: "Cook Nest" },
      { category: "home", subcategory: "Textiles", name: "Curtain House" },
      { category: "home", subcategory: "Rugs & Floors", name: "Rug Form" },
      { category: "home", subcategory: "Decor", name: "Haven Decor" },
      { category: "home", subcategory: "Workspace", name: "Nest Desk" },
    ],
  },
  {
    title: "Luxury Salon",
    categoryName: "Luxury & Beauty",
    stores: [
      { category: "luxury", subcategory: "Handbags", name: "Orélle Bags" },
      { category: "luxury", subcategory: "Fine Watches", name: "Maison Time" },
      { category: "luxury", subcategory: "Jewelry", name: "Diamond Row" },
      { category: "luxury", subcategory: "Couture", name: "Silk Salon" },
      { category: "luxury", subcategory: "Signature Scent", name: "V Fragrance" },
      { category: "beauty", subcategory: "Spa Beauty", name: "LUMIÉ Spa" },
      { category: "luxury", subcategory: "Gift Salon", name: "Maison Gift" },
      { category: "fashion", subcategory: "Evening Wear", name: "AURA Evening" },
    ],
  },
  {
    title: "Play Court",
    categoryName: "Food & Entertainment",
    stores: [
      { category: "food", subcategory: "Coffee Bar", name: "Café Court" },
      { category: "gaming", subcategory: "Console Zone", name: "Neon Play" },
      { category: "food", subcategory: "Snack Lane", name: "Bites Lane" },
      { category: "fashion", subcategory: "Fan Merch", name: "Thread Fan" },
      { category: "gaming", subcategory: "Headset Hub", name: "Level Audio" },
      { category: "food", subcategory: "Dessert Desk", name: "Sweet Atrium" },
      { category: "electronics", subcategory: "Gadgets", name: "Pixel Fun" },
      { category: "gaming", subcategory: "Esports Café", name: "Arena Café" },
    ],
  },
];

const wings = ["north", "east", "south", "west", "plaza", "lane", "court", "gate"] as const;

function createProducts(
  storeId: string,
  category: MallCategory,
  subcategory: string,
  storeName: string,
  count: number,
): Product[] {
  const pool = categoryPools[category];
  return Array.from({ length: count }, (_, i) => {
    const id = `${storeId}-p-${i}`;
    const baseName = pool[i % pool.length];
    const name = `${baseName} ${i + 1}`;
    return {
      id,
      name,
      price: 999 + (i + 1) * 311,
      rating: 4 + ((i % 10) * 0.08),
      colors: ["Black", "White", "Blue"],
      sizes: ["S", "M", "L", "XL"],
      shelfIndex: i,
      storeId,
      category,
      subcategory,
      image: productImage(baseName, id),
      description: `${name} from ${storeName} · ${subcategory} on this floor’s ${category} edit — premium finish, showroom-ready details.`,
    };
  });
}

export const mallFloors: MallFloor[] = floorPrograms.map((program, level) => {
  const stores: StoreNode[] = program.stores.map((spec, i) => {
    const wing = wings[i];
    const id = `f${level}-${wing}-${spec.category}-${i}`;
    return {
      id,
      name: spec.name,
      category: spec.category,
      subcategory: spec.subcategory,
      floor: level,
      wing,
      theme: themes[spec.category],
      doorImage: storeDoorImage(spec.subcategory, spec.category, id),
      products: createProducts(id, spec.category, spec.subcategory, spec.name, 18),
    };
  });

  const subcategories = [...new Set(stores.map((s) => s.subcategory))];

  return {
    id: `floor-${level}`,
    level,
    label: level === 0 ? "G" : `0${level}`,
    title: program.title,
    categoryName: program.categoryName,
    subcategories,
    stores,
  };
});

export const allProducts = mallFloors.flatMap((f) => f.stores.flatMap((s) => s.products));

export function storeCollage(store: StoreNode, i: number): string {
  return categoryCollageImage(store.category, store.id, i);
}
