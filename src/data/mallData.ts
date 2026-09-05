import type { MallFloor, MallCategory, Product, StoreNode } from "@/types/mall";
import { categoryCollageImage, productImage, storeDoorImage } from "@/lib/images";

/** Professional catalog lines — name matches curated photo */
const categoryPools: Record<MallCategory, string[]> = {
  fashion: [
    "Merino Overcoat",
    "City Runner",
    "Selvedge Denim",
    "Oxford Shirt",
    "Field Watch",
    "Wool Topcoat",
    "Studio Hoodie",
  ],
  beauty: [
    "Vitamin C Serum",
    "Satin Lip Color",
    "Eau de Parfum",
    "Clay Mask",
    "Gentle Cleanser",
    "Night Cream",
  ],
  electronics: [
    "Ultrabook Pro",
    "Flagship Phone",
    "Pro Tablet",
    "Mirrorless Camera",
    "Bluetooth Speaker",
    "4K Display",
  ],
  sports: [
    "Trail Trainer",
    "Match Football",
    "Studio Yoga Mat",
    "Road Running Shoe",
    "Insulated Bottle",
    "Team Jersey",
  ],
  home: [
    "Lounge Sofa",
    "Arc Floor Lamp",
    "Dining Chair",
    "Copper Cookware",
    "Linen Curtain",
    "Wool Area Rug",
  ],
  luxury: [
    "Leather Tote",
    "Heritage Chronograph",
    "Solitaire Ring",
    "Silk Evening Suit",
    "Signature Fragrance",
  ],
  food: [
    "Barista Coffee Set",
    "Gourmet Snack Box",
    "Porcelain Tea Set",
    "Artisan Cookies",
    "Cold-Pressed Juice",
    "Butter Croissant",
  ],
  gaming: [
    "Studio Headset",
    "Pro Controller",
    "Mechanical Keyboard",
    "Next-Gen Console",
    "Precision Mouse",
    "Ergo Desk Chair",
  ],
};

const productBlurbs: Record<string, string> = {
  "Merino Overcoat": "Tailored merino wool overcoat with a clean silhouette for cooler seasons.",
  "City Runner": "Lightweight everyday runner engineered for comfort across long city walks.",
  "Selvedge Denim": "Premium selvedge denim with a refined wash and lasting structure.",
  "Oxford Shirt": "Crisp oxford cotton shirt suited for workdays and smart-casual evenings.",
  "Field Watch": "Minimal stainless-steel timepiece with a precision quartz movement.",
  "Wool Topcoat": "Full-length wool topcoat with a structured lapel and polished finish.",
  "Studio Hoodie": "Heavyweight fleece hoodie designed for layered everyday wear.",
  "Vitamin C Serum": "Brightening serum formulated for even tone and everyday skin clarity.",
  "Satin Lip Color": "Long-wear satin lip color with a smooth, comfortable finish.",
  "Eau de Parfum": "Layered eau de parfum with lasting projection and a modern signature.",
  "Clay Mask": "Purifying clay mask that refreshes and balances the skin.",
  "Gentle Cleanser": "Dermatologist-inspired cleanser for a clean feel without dryness.",
  "Night Cream": "Restorative night cream that supports overnight skin recovery.",
  "Ultrabook Pro": "Slim performance laptop built for work, travel, and creative workflows.",
  "Flagship Phone": "Flagship smartphone with a vivid display and all-day battery design.",
  "Pro Tablet": "High-resolution tablet for reading, sketching, and on-the-go productivity.",
  "Mirrorless Camera": "Compact mirrorless camera for sharp stills and cinematic video.",
  "Bluetooth Speaker": "Portable speaker with rich sound and a durable everyday chassis.",
  "4K Display": "Color-accurate 4K monitor for design, editing, and focused desk work.",
  "Trail Trainer": "Supportive trail trainer for training days and outdoor sessions.",
  "Match Football": "Match-grade football built for grip, control, and consistent flight.",
  "Studio Yoga Mat": "Non-slip studio mat with stable cushioning for daily practice.",
  "Road Running Shoe": "Responsive road shoe tuned for tempo runs and long distances.",
  "Insulated Bottle": "Double-wall insulated bottle that keeps drinks cold or hot for hours.",
  "Team Jersey": "Breathable performance jersey for training and match-day wear.",
  "Lounge Sofa": "Deep-seat lounge sofa upholstered for comfort and living-room presence.",
  "Arc Floor Lamp": "Sculptural arc lamp that delivers soft ambient light with presence.",
  "Dining Chair": "Ergonomic dining chair with a refined frame and lasting comfort.",
  "Copper Cookware": "Professional copper cookware for even heat and polished kitchen style.",
  "Linen Curtain": "Soft linen curtain panels that filter light with understated texture.",
  "Wool Area Rug": "Hand-finished wool rug that anchors a room with quiet warmth.",
  "Leather Tote": "Full-grain leather tote with clean lines and everyday capacity.",
  "Heritage Chronograph": "Heritage chronograph with sapphire crystal and refined detailing.",
  "Solitaire Ring": "Classic solitaire setting crafted for everyday elegance.",
  "Silk Evening Suit": "Silk-blend evening suit tailored for formal occasions.",
  "Signature Fragrance": "Signature fragrance with balanced top notes and a lasting dry-down.",
  "Barista Coffee Set": "Home barista set for precise brewing and café-quality cups.",
  "Gourmet Snack Box": "Curated snack assortment selected for sharing and gifting.",
  "Porcelain Tea Set": "Porcelain tea service with a calm glaze and everyday durability.",
  "Artisan Cookies": "Fresh-baked artisan cookies with a rich, bakery-quality finish.",
  "Cold-Pressed Juice": "Cold-pressed juice blend prepared for clean flavor and freshness.",
  "Butter Croissant": "Flaky butter croissant baked for a golden exterior and soft crumb.",
  "Studio Headset": "Studio headset with clear audio and a comfortable long-session fit.",
  "Pro Controller": "Precision controller tuned for responsive play and all-day comfort.",
  "Mechanical Keyboard": "Mechanical keyboard with tactile switches and a durable build.",
  "Next-Gen Console": "Next-generation console ready for high-fidelity games and media.",
  "Precision Mouse": "High-precision mouse for accurate tracking and desk productivity.",
  "Ergo Desk Chair": "Ergonomic desk chair designed for posture support through long workdays.",
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

const floorPrograms: FloorProgram[] = [
  {
    title: "Ground Atrium",
    categoryName: "Fashion & Dining",
    stores: [
      { category: "fashion", subcategory: "Ready-to-Wear", name: "AURA Atelier" },
      { category: "beauty", subcategory: "Beauty Studio", name: "Lumié Beauty" },
      { category: "food", subcategory: "Café Court", name: "Atrium Café" },
      { category: "fashion", subcategory: "Contemporary Style", name: "Thread & Co." },
      { category: "beauty", subcategory: "Fragrance Desk", name: "Bloom Lab" },
      { category: "food", subcategory: "Confectionery", name: "Bites Court" },
      { category: "fashion", subcategory: "Denim Collection", name: "Indigo Row" },
      { category: "luxury", subcategory: "Gift Boutique", name: "Maison Petit" },
    ],
  },
  {
    title: "Style Runway",
    categoryName: "Apparel & Sport",
    stores: [
      { category: "fashion", subcategory: "Runway Edit", name: "AURA Runway" },
      { category: "sports", subcategory: "Activewear", name: "Velocity Gear" },
      { category: "luxury", subcategory: "Tailoring", name: "Orélle House" },
      { category: "fashion", subcategory: "Footwear", name: "Step Form" },
      { category: "sports", subcategory: "Training", name: "Field Pro" },
      { category: "beauty", subcategory: "Active Beauty", name: "Glow Active" },
      { category: "luxury", subcategory: "Accessories", name: "Maison V" },
      { category: "fashion", subcategory: "Casual Wear", name: "Thread Daily" },
    ],
  },
  {
    title: "Tech Pavilion",
    categoryName: "Electronics & Gaming",
    stores: [
      { category: "electronics", subcategory: "Computing", name: "Nextron Core" },
      { category: "gaming", subcategory: "Game Arena", name: "Neon Arena" },
      { category: "electronics", subcategory: "Mobile", name: "Pixel Bay" },
      { category: "electronics", subcategory: "Audio", name: "Sound Dock" },
      { category: "gaming", subcategory: "Controllers", name: "Level Up" },
      { category: "electronics", subcategory: "Imaging", name: "Lens Bay" },
      { category: "gaming", subcategory: "Esports", name: "Arena Desk" },
      { category: "electronics", subcategory: "Connected Home", name: "Nextron Home" },
    ],
  },
  {
    title: "Living Loft",
    categoryName: "Home & Interiors",
    stores: [
      { category: "home", subcategory: "Living Room", name: "Haven Lounge" },
      { category: "home", subcategory: "Lighting", name: "Nest Light" },
      { category: "home", subcategory: "Seating", name: "Form Chair" },
      { category: "home", subcategory: "Kitchen", name: "Cook Nest" },
      { category: "home", subcategory: "Textiles", name: "Curtain House" },
      { category: "home", subcategory: "Floor Coverings", name: "Rug Form" },
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
      { category: "luxury", subcategory: "Fragrance", name: "V Fragrance" },
      { category: "beauty", subcategory: "Spa Beauty", name: "Lumié Spa" },
      { category: "luxury", subcategory: "Gifting", name: "Maison Gift" },
      { category: "fashion", subcategory: "Evening Wear", name: "AURA Evening" },
    ],
  },
  {
    title: "Play Court",
    categoryName: "Dining & Entertainment",
    stores: [
      { category: "food", subcategory: "Coffee Bar", name: "Court Café" },
      { category: "gaming", subcategory: "Console Zone", name: "Neon Play" },
      { category: "food", subcategory: "Snack Lane", name: "Bites Lane" },
      { category: "fashion", subcategory: "Lifestyle Merch", name: "Thread Fan" },
      { category: "gaming", subcategory: "Audio Hub", name: "Level Audio" },
      { category: "food", subcategory: "Dessert Desk", name: "Sweet Atrium" },
      { category: "electronics", subcategory: "Gadgets", name: "Pixel Lab" },
      { category: "gaming", subcategory: "Esports Café", name: "Arena Café" },
    ],
  },
];

const wings = ["north", "east", "south", "west", "plaza", "lane", "court", "gate"] as const;

const finishes = ["Noir", "Ivory", "Slate", "Sand", "Ink", "Pearl"] as const;

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
    const finish = finishes[i % finishes.length];
    const name = `${baseName} · ${finish}`;
    const blurb = productBlurbs[baseName] ?? `${baseName} from the ${storeName} collection.`;
    return {
      id,
      name,
      price: 1499 + (i + 1) * 350 + (category === "luxury" ? 4000 : 0),
      rating: 4.2 + ((i % 8) * 0.1),
      colors: ["Black", "Ivory", "Navy"],
      sizes: category === "electronics" || category === "home" || category === "food"
        ? ["One Size"]
        : ["S", "M", "L", "XL"],
      shelfIndex: i,
      storeId,
      category,
      subcategory,
      image: productImage(baseName, id, category),
      description: `${blurb} Available at ${storeName} in ${subcategory}.`,
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
      doorImage: storeDoorImage(spec.name, spec.category, id),
      products: createProducts(id, spec.category, spec.subcategory, spec.name, 12),
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
