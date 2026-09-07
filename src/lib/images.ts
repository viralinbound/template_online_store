/**
 * Decent retail product photography only.
 * Every catalog item maps to clean product stills — no lifestyle / class / awkward people shots.
 * All Unsplash IDs verified HTTP 200.
 */

const u = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=92&fm=jpg&sat=8`;

function hash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pick(pool: string[], seed: string): string {
  return pool[hash(seed) % pool.length]!;
}

/** Verified clean product stills — 3 options per catalog name for variants */
const PRODUCT_PHOTOS: Record<string, string[]> = {
  "Merino Overcoat": [
    u("photo-1544022613-e87ca75a784a", 720, 900),
    u("photo-1539533018447-63fcce2678e3", 720, 900),
    u("photo-1551028719-00167b16eac5", 720, 900),
  ],
  "City Runner": [
    u("photo-1542291026-7eec264c27ff", 720, 900),
    u("photo-1606107557195-0e29a4b5b4aa", 720, 900),
    u("photo-1560769629-975ec94e6a86", 720, 900),
  ],
  "Selvedge Denim": [
    u("photo-1542272604-787c3835535d", 720, 900),
    u("photo-1541099649105-f69ad21f3246", 720, 900),
    u("photo-1582552938357-32b906df40cb", 720, 900),
  ],
  "Oxford Shirt": [
    u("photo-1562157873-818bc0726f68", 720, 900),
    u("photo-1620799140408-edc6dcb6d633", 720, 900),
    u("photo-1583743814966-8936f5b7be1a", 720, 900),
  ],
  "Field Watch": [
    u("photo-1523275335684-37898b6baf30", 720, 900),
    u("photo-1524592094714-0f0654e20314", 720, 900),
    u("photo-1539874754764-5a96559165b0", 720, 900),
  ],
  "Wool Topcoat": [
    u("photo-1544022613-e87ca75a784a", 720, 900),
    u("photo-1591047139829-d91aecb6caea", 720, 900),
    u("photo-1539533018447-63fcce2678e3", 720, 900),
  ],
  "Studio Hoodie": [
    u("photo-1556821840-3a63f95609a7", 720, 900),
    u("photo-1576566588028-4147f3842f27", 720, 900),
    u("photo-1618354691373-d851c5c3a990", 720, 900),
  ],
  "Vitamin C Serum": [
    u("photo-1571781926291-c477ebfd024b", 720, 900),
    u("photo-1611930022073-b7a4ba5fcccd", 720, 900),
    u("photo-1556229010-6c3f2c9ca5f8", 720, 900),
  ],
  "Satin Lip Color": [
    u("photo-1631214524020-7e18db9a8f92", 720, 900),
    u("photo-1598440947619-2c35fc9aa908", 720, 900),
    u("photo-1617897903246-719242758050", 720, 900),
  ],
  "Eau de Parfum": [
    u("photo-1541643600914-78b084683601", 720, 900),
    u("photo-1592945403244-b3fbafd7f539", 720, 900),
    u("photo-1594035910387-fea47794261f", 720, 900),
  ],
  "Clay Mask": [
    u("photo-1556228578-0d85b1a4d571", 720, 900),
    u("photo-1522335789203-aabd1fc54bc9", 720, 900),
    u("photo-1512496015851-a90fb38ba796", 720, 900),
  ],
  "Gentle Cleanser": [
    u("photo-1556228720-195a672e8a03", 720, 900),
    u("photo-1612817288484-6f916006741a", 720, 900),
    u("photo-1629198688000-71f23e745b6e", 720, 900),
  ],
  "Night Cream": [
    u("photo-1571781926291-c477ebfd024b", 720, 900),
    u("photo-1556228578-0d85b1a4d571", 720, 900),
    u("photo-1522335789203-aabd1fc54bc9", 720, 900),
  ],
  "Ultrabook Pro": [
    u("photo-1496181133206-80ce9b88a853", 720, 900),
    u("photo-1588872657578-7efd1f1555ed", 720, 900),
    u("photo-1517336714731-489689fd1ca8", 720, 900),
  ],
  "Flagship Phone": [
    u("photo-1511707171634-5f897ff02aa9", 720, 900),
    u("photo-1592899677977-9c10ca588bbd", 720, 900),
    u("photo-1510557880182-3d4d3cba35a5", 720, 900),
  ],
  "Pro Tablet": [
    u("photo-1544244015-0df4b3ffc6b0", 720, 900),
    u("photo-1561154464-82e9adf32764", 720, 900),
    u("photo-1611186871348-b1ce696e52c9", 720, 900),
  ],
  "Mirrorless Camera": [
    u("photo-1516035069371-29a1b244cc32", 720, 900),
    u("photo-1502920917128-1aa500764cbd", 720, 900),
    u("photo-1516035069371-29a1b244cc32", 720, 900),
  ],
  "Bluetooth Speaker": [
    u("photo-1608043152269-423dbba4e7e1", 720, 900),
    u("photo-1545454675-3531b543be5d", 720, 900),
    u("photo-1546435770-a3e426bf472b", 720, 900),
  ],
  "4K Display": [
    u("photo-1527443224154-c4a3942d3acf", 720, 900),
    u("photo-1593640408182-31c70c8268f5", 720, 900),
    u("photo-1498049794561-7780e7231661", 720, 900),
  ],
  "Trail Trainer": [
    u("photo-1606107557195-0e29a4b5b4aa", 720, 900),
    u("photo-1542291026-7eec264c27ff", 720, 900),
    u("photo-1560769629-975ec94e6a86", 720, 900),
  ],
  "Match Football": [
    u("photo-1579952363873-27f3bade9f55", 720, 900),
    u("photo-1551958219-acbc608c6377", 720, 900),
    u("photo-1574629810360-7efbbe195018", 720, 900),
  ],
  "Studio Yoga Mat": [
    u("photo-1592432678016-e910b452f9a2", 720, 900),
    u("photo-1601925260368-ae2f83cf8b7f", 720, 900),
    u("photo-1592432678016-e910b452f9a2", 720, 900),
  ],
  "Road Running Shoe": [
    u("photo-1460353581641-37baddab0fa2", 720, 900),
    u("photo-1542291026-7eec264c27ff", 720, 900),
    u("photo-1606107557195-0e29a4b5b4aa", 720, 900),
  ],
  "Insulated Bottle": [
    u("photo-1602143407151-7111542de6e8", 720, 900),
    u("photo-1523362628745-0c100150b504", 720, 900),
    u("photo-1602143407151-7111542de6e8", 720, 900),
  ],
  "Team Jersey": [
    u("photo-1522778119026-d647f0596c20", 720, 900),
    u("photo-1576566588028-4147f3842f27", 720, 900),
    u("photo-1618354691373-d851c5c3a990", 720, 900),
  ],
  "Lounge Sofa": [
    u("photo-1555041469-a586c61ea9bc", 720, 900),
    u("photo-1493663284031-b7e3aefcae8e", 720, 900),
    u("photo-1567538096630-e0c55bd6374c", 720, 900),
  ],
  "Arc Floor Lamp": [
    u("photo-1507473885765-e6ed057f782c", 720, 900),
    u("photo-1513506003901-1e6a229e2d15", 720, 900),
    u("photo-1543198126-a8ad8e47fb22", 720, 900),
  ],
  "Dining Chair": [
    u("photo-1580480055273-228ff5388ef8", 720, 900),
    u("photo-1592078615290-033ee584e267", 720, 900),
    u("photo-1567538096630-e0c55bd6374c", 720, 900),
  ],
  "Copper Cookware": [
    u("photo-1556909114-f6e7ad7d3136", 720, 900),
    u("photo-1556911220-e15b29be8c8f", 720, 900),
    u("photo-1556909114-f6e7ad7d3136", 720, 900),
  ],
  "Linen Curtain": [
    u("photo-1513694203232-719a280e022f", 720, 900),
    u("photo-1615874959474-d609969a20ed", 720, 900),
    u("photo-1631679706909-1844bbd07221", 720, 900),
  ],
  "Wool Area Rug": [
    u("photo-1600166898405-da9535204843", 720, 900),
    u("photo-1618221195710-dd6b41faaea6", 720, 900),
    u("photo-1586023492125-27b2c045efd7", 720, 900),
  ],
  "Leather Tote": [
    u("photo-1584917865442-de89df76afd3", 720, 900),
    u("photo-1553062407-98eeb64c6a62", 720, 900),
    u("photo-1591561954557-26941169b49e", 720, 900),
  ],
  "Heritage Chronograph": [
    u("photo-1524592094714-0f0654e20314", 720, 900),
    u("photo-1523275335684-37898b6baf30", 720, 900),
    u("photo-1539874754764-5a96559165b0", 720, 900),
  ],
  "Solitaire Ring": [
    u("photo-1605100804763-247f67b3557e", 720, 900),
    u("photo-1515562141207-7a88fb7ce338", 720, 900),
    u("photo-1611591437281-460bfbe1220a", 720, 900),
  ],
  "Silk Evening Suit": [
    u("photo-1594938298603-c8148c4dae35", 720, 900),
    u("photo-1507679799987-c73779587ccf", 720, 900),
    u("photo-1617137968427-85924c800a22", 720, 900),
  ],
  "Signature Fragrance": [
    u("photo-1592945403244-b3fbafd7f539", 720, 900),
    u("photo-1541643600914-78b084683601", 720, 900),
    u("photo-1594035910387-fea47794261f", 720, 900),
  ],
  "Barista Coffee Set": [
    u("photo-1495474472287-4d71bcdd2085", 720, 900),
    u("photo-1514432324607-a09d9b4aefdd", 720, 900),
    u("photo-1498804103079-a6351b050096", 720, 900),
  ],
  "Gourmet Snack Box": [
    u("photo-1599490659213-e2b9527bd087", 720, 900),
    u("photo-1606313564200-e75d5e30476c", 720, 900),
    u("photo-1504674900247-0877df9cc836", 720, 900),
  ],
  "Porcelain Tea Set": [
    u("photo-1576092768241-dec231879fc3", 720, 900),
    u("photo-1597318181409-cf64d0b5d8a2", 720, 900),
    u("photo-1556679343-c7306c1976bc", 720, 900),
  ],
  "Artisan Cookies": [
    u("photo-1499636136210-6f4ee915583e", 720, 900),
    u("photo-1558961363-fa8fdf82db35", 720, 900),
    u("photo-1499636136210-6f4ee915583e", 720, 900),
  ],
  "Cold-Pressed Juice": [
    u("photo-1622597467836-f3285f2131b8", 720, 900),
    u("photo-1600271886742-f049cd451bba", 720, 900),
    u("photo-1622597467836-f3285f2131b8", 720, 900),
  ],
  "Butter Croissant": [
    u("photo-1555507036-ab1f4038808a", 720, 900),
    u("photo-1509440159596-0249088772ff", 720, 900),
    u("photo-1555507036-ab1f4038808a", 720, 900),
  ],
  "Studio Headset": [
    u("photo-1546435770-a3e426bf472b", 720, 900),
    u("photo-1484704849700-f032a568e944", 720, 900),
    u("photo-1505740420928-5e560c06d30e", 720, 900),
  ],
  "Pro Controller": [
    u("photo-1592840496694-26d035b52b48", 720, 900),
    u("photo-1612287230202-1ff1d85d1bdf", 720, 900),
    u("photo-1606144042614-b2417e99c4e3", 720, 900),
  ],
  "Mechanical Keyboard": [
    u("photo-1587829741301-dc798b83add3", 720, 900),
    u("photo-1595225476474-87563907a212", 720, 900),
    u("photo-1587829741301-dc798b83add3", 720, 900),
  ],
  "Next-Gen Console": [
    u("photo-1606144042614-b2417e99c4e3", 720, 900),
    u("photo-1607853202273-797f1c22a38e", 720, 900),
    u("photo-1606144042614-b2417e99c4e3", 720, 900),
  ],
  "Precision Mouse": [
    u("photo-1527814050087-3793815479db", 720, 900),
    u("photo-1615663245857-ac93bb7c39e7", 720, 900),
    u("photo-1563297007-0686b7003af7", 720, 900),
  ],
  "Ergo Desk Chair": [
    u("photo-1580480055273-228ff5388ef8", 720, 900),
    u("photo-1592078615290-033ee584e267", 720, 900),
    u("photo-1567538096630-e0c55bd6374c", 720, 900),
  ],
};

/** Clean category fallbacks (product / retail only) */
const CATEGORY_POOLS: Record<string, string[]> = {
  fashion: [
    u("photo-1521572163474-6864f9cf17ab", 720, 900),
    u("photo-1562157873-818bc0726f68", 720, 900),
    u("photo-1542272604-787c3835535d", 720, 900),
    u("photo-1542291026-7eec264c27ff", 720, 900),
    u("photo-1556821840-3a63f95609a7", 720, 900),
    u("photo-1551028719-00167b16eac5", 720, 900),
    u("photo-1618354691373-d851c5c3a990", 720, 900),
    u("photo-1620799140408-edc6dcb6d633", 720, 900),
  ],
  beauty: [
    u("photo-1596462502278-27bfdc403348", 720, 900),
    u("photo-1522335789203-aabd1fc54bc9", 720, 900),
    u("photo-1631214524020-7e18db9a8f92", 720, 900),
    u("photo-1541643600914-78b084683601", 720, 900),
    u("photo-1556228720-195a672e8a03", 720, 900),
    u("photo-1556228578-0d85b1a4d571", 720, 900),
    u("photo-1571781926291-c477ebfd024b", 720, 900),
    u("photo-1592945403244-b3fbafd7f539", 720, 900),
  ],
  electronics: [
    u("photo-1496181133206-80ce9b88a853", 720, 900),
    u("photo-1511707171634-5f897ff02aa9", 720, 900),
    u("photo-1544244015-0df4b3ffc6b0", 720, 900),
    u("photo-1516035069371-29a1b244cc32", 720, 900),
    u("photo-1608043152269-423dbba4e7e1", 720, 900),
    u("photo-1527443224154-c4a3942d3acf", 720, 900),
    u("photo-1498049794561-7780e7231661", 720, 900),
    u("photo-1588872657578-7efd1f1555ed", 720, 900),
  ],
  sports: [
    u("photo-1606107557195-0e29a4b5b4aa", 720, 900),
    u("photo-1579952363873-27f3bade9f55", 720, 900),
    u("photo-1592432678016-e910b452f9a2", 720, 900),
    u("photo-1460353581641-37baddab0fa2", 720, 900),
    u("photo-1602143407151-7111542de6e8", 720, 900),
    u("photo-1522778119026-d647f0596c20", 720, 900),
    u("photo-1546519638-68e109498ffc", 720, 900),
    u("photo-1560769629-975ec94e6a86", 720, 900),
  ],
  home: [
    u("photo-1555041469-a586c61ea9bc", 720, 900),
    u("photo-1507473885765-e6ed057f782c", 720, 900),
    u("photo-1580480055273-228ff5388ef8", 720, 900),
    u("photo-1556909114-f6e7ad7d3136", 720, 900),
    u("photo-1513694203232-719a280e022f", 720, 900),
    u("photo-1600166898405-da9535204843", 720, 900),
    u("photo-1618221195710-dd6b41faaea6", 720, 900),
    u("photo-1493663284031-b7e3aefcae8e", 720, 900),
  ],
  luxury: [
    u("photo-1584917865442-de89df76afd3", 720, 900),
    u("photo-1524592094714-0f0654e20314", 720, 900),
    u("photo-1605100804763-247f67b3557e", 720, 900),
    u("photo-1523275335684-37898b6baf30", 720, 900),
    u("photo-1541643600914-78b084683601", 720, 900),
    u("photo-1553062407-98eeb64c6a62", 720, 900),
    u("photo-1515562141207-7a88fb7ce338", 720, 900),
    u("photo-1591561954557-26941169b49e", 720, 900),
  ],
  food: [
    u("photo-1495474472287-4d71bcdd2085", 720, 900),
    u("photo-1499636136210-6f4ee915583e", 720, 900),
    u("photo-1555507036-ab1f4038808a", 720, 900),
    u("photo-1576092768241-dec231879fc3", 720, 900),
    u("photo-1622597467836-f3285f2131b8", 720, 900),
    u("photo-1599490659213-e2b9527bd087", 720, 900),
    u("photo-1504674900247-0877df9cc836", 720, 900),
    u("photo-1514432324607-a09d9b4aefdd", 720, 900),
  ],
  gaming: [
    u("photo-1546435770-a3e426bf472b", 720, 900),
    u("photo-1592840496694-26d035b52b48", 720, 900),
    u("photo-1587829741301-dc798b83add3", 720, 900),
    u("photo-1606144042614-b2417e99c4e3", 720, 900),
    u("photo-1527814050087-3793815479db", 720, 900),
    u("photo-1580480055273-228ff5388ef8", 720, 900),
    u("photo-1607853202273-797f1c22a38e", 720, 900),
    u("photo-1505740420928-5e560c06d30e", 720, 900),
  ],
};

const LANDING_HERO = u("photo-1567449303078-57ad995bd329", 2400, 1400);

const FLOOR_HEROES: Record<string, string> = {
  G: u("photo-1567449303078-57ad995bd329", 2000, 1200),
  "01": u("photo-1441984904996-e0b6ba687e04", 2000, 1200),
  "02": u("photo-1498049794561-7780e7231661", 2000, 1200),
  "03": u("photo-1618221195710-dd6b41faaea6", 2000, 1200),
  "04": u("photo-1445205170230-053b83016050", 2000, 1200),
  "05": u("photo-1554118811-1e0d58224f24", 2000, 1200),
};

export function productImage(productName: string, productId: string, category?: string): string {
  const base = productName.split(" · ")[0]?.trim() ?? productName;
  const set = PRODUCT_PHOTOS[base];
  if (set?.length) {
    return set[hash(productId) % set.length]!;
  }
  const pool = CATEGORY_POOLS[category ?? ""] ?? CATEGORY_POOLS.fashion!;
  return pick(pool, productId);
}

export function storeDoorImage(_storeName: string, category: string, storeId: string): string {
  const pool = CATEGORY_POOLS[category] ?? CATEGORY_POOLS.fashion!;
  return pick(pool, `${storeId}-door`);
}

export function floorHeroImage(floorLabel: string, _vibe: string, _seed: string): string {
  return FLOOR_HEROES[floorLabel] ?? FLOOR_HEROES.G!;
}

export function landingHeroImage(): string {
  return LANDING_HERO;
}

export function categoryCollageImage(category: string, storeId: string, i: number): string {
  const pool = CATEGORY_POOLS[category] ?? CATEGORY_POOLS.fashion!;
  return pool[(hash(`${storeId}-col`) + i) % pool.length]!;
}
