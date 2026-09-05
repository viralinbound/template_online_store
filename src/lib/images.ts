/**
 * Clean professional product photography only.
 * No odd lifestyle / mismatched shots — retail-safe stills.
 * Each product id maps to a unique stable image within its category.
 */

const u = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=85&fm=jpg`;

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

/** Clean apparel / footwear product shots */
const FASHION = [
  u("photo-1521572163474-6864f9cf17ab", 720, 900), // white tee product
  u("photo-1596755094514-f87e34085b85", 720, 900), // shirt folded
  u("photo-1542272604-787c3835535d", 720, 900), // jeans
  u("photo-1542291026-7eec264c27ff", 720, 900), // sneaker
  u("photo-1460353581641-37baddab0fa2", 720, 900), // running shoes
  u("photo-1523275335684-37898b6baf30", 720, 900), // watch product
  u("photo-1556821840-3a63f95609a7", 720, 900), // hoodie
  u("photo-1551028719-00167b16eac5", 720, 900), // leather jacket
  u("photo-1591047139829-d91aecb6caea", 720, 900), // jacket rack
  u("photo-1618354691373-d851c5c3a990", 720, 900), // black tee
  u("photo-1489987707025-941f175c5f6a", 720, 900), // folded clothes
  u("photo-1434389677669-e08b4cac3105", 720, 900), // sweater
  u("photo-1544022613-e87ca75a784a", 720, 900), // coat
  u("photo-1539533018447-63fcce2678e3", 720, 900), // coat rack
  u("photo-1606107557195-0e29a4b5b4aa", 720, 900), // sneakers pair
  u("photo-1560769629-975ec94e6a86", 720, 900), // colorful sneakers
];

/** Clean beauty product stills */
const BEAUTY = [
  u("photo-1596462502278-27bfdc403348", 720, 900),
  u("photo-1522335789203-aabd1fc54bc9", 720, 900),
  u("photo-1571781926291-c477ebfd024b", 720, 900),
  u("photo-1586495777744-4413f210f97e", 720, 900),
  u("photo-1541643600914-78b084683601", 720, 900),
  u("photo-1556228720-195a672e8a03", 720, 900),
  u("photo-1556228578-0d85b1a4d571", 720, 900),
  u("photo-1620916297397-a3c12374e35f", 720, 900),
  u("photo-1592945403244-b3fbafd7f539", 720, 900),
  u("photo-1612817288484-6f916006741a", 720, 900),
  u("photo-1598440947619-2c35fc9aa908", 720, 900),
  u("photo-1631214524020-7e18db9a8f92", 720, 900),
  u("photo-1570194065650-d99241b825ad", 720, 900),
  u("photo-1512496015851-a90fb38ba796", 720, 900),
  u("photo-1629198688000-71f23e745b6e", 720, 900),
  u("photo-1608248543800-ba5401bb1bd2", 720, 900),
];

/** Clean electronics product shots */
const ELECTRONICS = [
  u("photo-1496181133206-80ce9b88a853", 720, 900),
  u("photo-1511707171634-5f897ff02aa9", 720, 900),
  u("photo-1544244015-0df4b3ffc6b0", 720, 900),
  u("photo-1516035069371-29a1b244cc32", 720, 900),
  u("photo-1608043152269-423dbba4e7e1", 720, 900),
  u("photo-1527443224154-c4a3942d3acf", 720, 900),
  u("photo-1498049794561-7780e7231661", 720, 900),
  u("photo-1588872657578-7efd1f1555ed", 720, 900),
  u("photo-1593640408182-31c70c8268f5", 720, 900),
  u("photo-1484704849700-f032a568e944", 720, 900),
  u("photo-1505740420928-5e560c06d30e", 720, 900),
  u("photo-1572569511254-d8f925fe2cbb", 720, 900),
  u("photo-1518770660439-4636190af475", 720, 900),
  u("photo-1550009158-9a7041f75a55", 720, 900),
  u("photo-1585792180666-f4588e99abe7", 720, 900),
  u("photo-1525547719533-d8e6b6b8c7f9", 720, 900),
];

/** Clean sports / fitness product shots */
const SPORTS = [
  u("photo-1606107557195-0e29a4b5b4aa", 720, 900),
  u("photo-1579952363873-27f3bade9f55", 720, 900),
  u("photo-1601925260368-ae2f83cf8b7f", 720, 900),
  u("photo-1460353581641-37baddab0fa2", 720, 900),
  u("photo-1602143407151-7111542de6e8", 720, 900),
  u("photo-1522778119026-d647f0596c20", 720, 900),
  u("photo-1517836357463-d25dfeac3438", 720, 900),
  u("photo-1571019614242-c5c5dee9f50b", 720, 900),
  u("photo-1518611012118-696072aa579a", 720, 900),
  u("photo-1571902943202-507ec2618e8f", 720, 900),
  u("photo-1546519638-68e109498ffc", 720, 900),
  u("photo-1534438327276-14e5300c3a48", 720, 900),
  u("photo-1517649763962-0c623066013b", 720, 900),
  u("photo-1476480862126-209bfaa8edc8", 720, 900),
  u("photo-1461896836934-ffe607ba6856", 720, 900),
  u("photo-1552674605-db6ffd4facb5", 720, 900),
];

/** Clean home / furniture product shots */
const HOME = [
  u("photo-1555041469-a586c61ea9bc", 720, 900),
  u("photo-1507473885765-e6ed057f782c", 720, 900),
  u("photo-1506439773649-6e0eb8d19f1d", 720, 900),
  u("photo-1556911220-bff31c812dce", 720, 900),
  u("photo-1513694203232-719a280e022f", 720, 900),
  u("photo-1600166898405-da9535204843", 720, 900),
  u("photo-1616486338812-3dadae4b4ace", 720, 900),
  u("photo-1586023492125-27b2c045efd7", 720, 900),
  u("photo-1618221195710-dd6b41faaea6", 720, 900),
  u("photo-1493663284031-b7e3aefcae8e", 720, 900),
  u("photo-1567538096630-e0c55bd6374c", 720, 900),
  u("photo-1524758631624-e2822e304c36", 720, 900),
  u("photo-1615874959474-d609969a20ed", 720, 900),
  u("photo-1631679706909-1844bbd07221", 720, 900),
  u("photo-1484101403633-562f8915981b", 720, 900),
  u("photo-1560185007-cde436f6a4d0", 720, 900),
];

/** Clean luxury product shots */
const LUXURY = [
  u("photo-1584917865442-de89df76afd3", 720, 900),
  u("photo-1524592094714-0f0654e20314", 720, 900),
  u("photo-1605100804763-247f67b3557e", 720, 900),
  u("photo-1523275335684-37898b6baf30", 720, 900),
  u("photo-1541643600914-78b084683601", 720, 900),
  u("photo-1592945403244-b3fbafd7f539", 720, 900),
  u("photo-1548036328-c085553f81ed", 720, 900),
  u("photo-1617038260897-41a1f14a8ca0", 720, 900),
  u("photo-1553062407-98eeb64c6a62", 720, 900),
  u("photo-1627123424574-724758594e93", 720, 900),
  u("photo-1611591437281-460bfbe1220a", 720, 900),
  u("photo-1515562141207-7a88fb7ce338", 720, 900),
  u("photo-1560472355-536de3962603", 720, 900),
  u("photo-1506630448388-4e683c668076", 720, 900),
  u("photo-1611080626919-7cf5a9dbab5b", 720, 900),
  u("photo-1594938298603-c8148c4dae35", 720, 900),
];

/** Clean food / café product shots */
const FOOD = [
  u("photo-1495474472287-4d71bcdd2085", 720, 900),
  u("photo-1499636136210-6f4ee915583e", 720, 900),
  u("photo-1555507036-ab1f4038808a", 720, 900),
  u("photo-1576092768241-dec231879fc3", 720, 900),
  u("photo-1622597467836-f3285f2131b8", 720, 900),
  u("photo-1621939514649-53722561e340", 720, 900),
  u("photo-1504674900247-0877df9cc836", 720, 900),
  u("photo-1567620905732-2d1ec7ab7445", 720, 900),
  u("photo-1484723091739-30a097e8f929", 720, 900),
  u("photo-1565299624946-b28f40a0ae38", 720, 900),
  u("photo-1482049016688-2d3e1b311543", 720, 900),
  u("photo-1512621776951-a57141f2eefd", 720, 900),
  u("photo-1414235077428-338989a2e8c0", 720, 900),
  u("photo-1554118811-1e0d58224f24", 720, 900),
  u("photo-1476224203421-9ac39bcb3327", 720, 900),
  u("photo-1559339352-11d035aa65de", 720, 900),
];

/** Clean gaming / tech accessory shots */
const GAMING = [
  u("photo-1546435770-a3e426bf472b", 720, 900),
  u("photo-1592840496694-26d035b52b48", 720, 900),
  u("photo-1587829741301-dc798b83add3", 720, 900),
  u("photo-1606144042614-b2417e99c4e3", 720, 900),
  u("photo-1527814050087-3793815479db", 720, 900),
  u("photo-1580480055273-228ff5388ef8", 720, 900),
  u("photo-1593305841994-095d8e16ff1d", 720, 900),
  u("photo-1607853202273-797f1c22a38e", 720, 900),
  u("photo-1550745165-9bc0b252726f", 720, 900),
  u("photo-1493711662062-fa541adb3fc8", 720, 900),
  u("photo-1511512578047-dfb367046420", 720, 900),
  u("photo-1612287230202-1ff1d85d1bdf", 720, 900),
  u("photo-1552820728-8b83bb6b773f", 720, 900),
  u("photo-1542751371-adc38448a05e", 720, 900),
  u("photo-1538481199705-c710c4e965fc", 720, 900),
  u("photo-1616587894289-86480e533129", 720, 900),
];

const BY_CATEGORY: Record<string, string[]> = {
  fashion: FASHION,
  beauty: BEAUTY,
  electronics: ELECTRONICS,
  sports: SPORTS,
  home: HOME,
  luxury: LUXURY,
  food: FOOD,
  gaming: GAMING,
};

/** Clean retail atrium / mall interior for landing */
const LANDING_HERO = u("photo-1441986300917-64674bd600d8", 1920, 1200);

const FLOOR_HEROES: Record<string, string> = {
  G: u("photo-1441986300917-64674bd600d8", 1600, 1000),
  "01": u("photo-1441984904996-e0b6ba687e04", 1600, 1000),
  "02": u("photo-1498049794561-7780e7231661", 1600, 1000),
  "03": u("photo-1618221195710-dd6b41faaea6", 1600, 1000),
  "04": u("photo-1445205170230-053b83016050", 1600, 1000),
  "05": u("photo-1554118811-1e0d58224f24", 1600, 1000),
};

export function productImage(_productName: string, productId: string, category?: string): string {
  const pool = BY_CATEGORY[category ?? ""] ?? FASHION;
  const match = productId.match(/-p-(\d+)$/);
  const index = match ? Number(match[1]) : 0;
  const storeKey = productId.replace(/-p-\d+$/, "");
  const offset = hash(storeKey) % pool.length;
  return pool[(offset + index) % pool.length]!;
}

export function storeDoorImage(_storeName: string, category: string, storeId: string): string {
  const pool = BY_CATEGORY[category] ?? FASHION;
  return pick(pool, `${storeId}-door`);
}

export function floorHeroImage(floorLabel: string, _vibe: string, _seed: string): string {
  return FLOOR_HEROES[floorLabel] ?? FLOOR_HEROES.G!;
}

export function landingHeroImage(): string {
  return LANDING_HERO;
}

export function categoryCollageImage(category: string, storeId: string, i: number): string {
  const pool = BY_CATEGORY[category] ?? FASHION;
  return pool[(hash(`${storeId}-col`) + i) % pool.length]!;
}
