/** Deterministic keyword images that match product / place names. */

function lockFrom(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return (h % 90000) + 1;
}

/** LoremFlickr tags → photo that roughly matches the name */
export function namedPhoto(tags: string, seed: string, w = 720, h = 900): string {
  const clean = tags
    .toLowerCase()
    .replace(/[^a-z0-9,\s-]/g, "")
    .trim()
    .replace(/\s+/g, ",");
  return `https://loremflickr.com/${w}/${h}/${clean}/all?lock=${lockFrom(seed)}`;
}

const PRODUCT_TAGS: Record<string, string> = {
  Jacket: "jacket,fashion,coat",
  Sneaker: "sneakers,shoes,footwear",
  Denim: "denim,jeans,fashion",
  Shirt: "shirt,fashion,clothing",
  Watch: "wristwatch,watch,luxury",
  Coat: "coat,fashion,winter",
  Hoodie: "hoodie,streetwear,fashion",
  Serum: "skincare,serum,beauty",
  Lipstick: "lipstick,makeup,beauty",
  Perfume: "perfume,fragrance,bottle",
  Mask: "face,mask,skincare",
  Cleanser: "skincare,cleanser,beauty",
  Cream: "cream,skincare,jar",
  Laptop: "laptop,computer,technology",
  Phone: "smartphone,phone,mobile",
  Tablet: "tablet,ipad,device",
  Camera: "camera,photography,lens",
  Speaker: "speaker,audio,bluetooth",
  Monitor: "monitor,display,computer",
  Trainer: "running,shoes,trainer",
  Football: "football,soccer,ball",
  "Yoga Mat": "yoga,mat,fitness",
  "Running Shoe": "running,shoes,sport",
  Bottle: "water,bottle,sport",
  Jersey: "jersey,sports,shirt",
  Sofa: "sofa,livingroom,furniture",
  Lamp: "lamp,lighting,interior",
  Chair: "chair,furniture,design",
  Cookware: "cookware,kitchen,pan",
  Curtain: "curtains,interior,home",
  Rug: "rug,carpet,interior",
  "Designer Bag": "handbag,luxury,bag",
  "Limited Watch": "luxury,watch,gold",
  "Diamond Ring": "diamond,ring,jewelry",
  "Silk Suit": "suit,fashion,formal",
  Fragrance: "perfume,fragrance,luxury",
  "Coffee Kit": "coffee,cafe,beans",
  "Snack Box": "snacks,food,box",
  "Tea Set": "tea,teapot,ceramic",
  "Cookie Pack": "cookies,bakery,dessert",
  "Juice Mix": "juice,drink,fruit",
  Pastry: "pastry,bakery,croissant",
  Headset: "gaming,headset,headphones",
  Controller: "game,controller,console",
  Keyboard: "keyboard,gaming,rgb",
  Console: "game,console,controller",
  Mouse: "gaming,mouse,computer",
};

const CATEGORY_TAGS: Record<string, string> = {
  fashion: "fashion,boutique,clothing",
  beauty: "beauty,cosmetics,makeup",
  electronics: "electronics,gadgets,tech",
  sports: "sports,fitness,athletic",
  home: "interior,home,furniture",
  luxury: "luxury,boutique,elegant",
  food: "cafe,food,restaurant",
  gaming: "gaming,esports,neon",
};

const FLOOR_TAGS: Record<string, string> = {
  G: "shopping,mall,atrium",
  "01": "fashion,runway,boutique",
  "02": "electronics,tech,gadgets",
  "03": "livingroom,interior,home",
  "04": "luxury,boutique,gold",
  "05": "entertainment,food,arcade",
};

export function productImage(productName: string, productId: string): string {
  const base = Object.keys(PRODUCT_TAGS).find((k) => productName.startsWith(k));
  const tags = base ? PRODUCT_TAGS[base] : productName.split(" ")[0] || "product,shop";
  return namedPhoto(tags, productId, 720, 900);
}

export function storeDoorImage(storeName: string, category: string, storeId: string): string {
  const tags = `${storeName},${CATEGORY_TAGS[category] ?? "store,shop"}`;
  return namedPhoto(tags, `${storeId}-door`, 700, 900);
}

export function floorHeroImage(floorLabel: string, vibe: string, seed: string): string {
  const tags = FLOOR_TAGS[floorLabel] ?? `${vibe},shopping,mall`;
  return namedPhoto(tags, seed, 1600, 1000);
}

export function landingHeroImage(): string {
  return namedPhoto("shopping,mall,architecture", "megamall-landing-hero", 1920, 1200);
}

export function categoryCollageImage(category: string, storeId: string, i: number): string {
  return namedPhoto(CATEGORY_TAGS[category] ?? "shop,retail", `${storeId}-col-${i}`, 800, 1000);
}
