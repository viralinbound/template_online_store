"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCatalog } from "@/components/CatalogProvider";
import { OrvaMarketingHome } from "@/components/pages/OrvaMarketingHome";
import { OrvaShell } from "@/components/shell/OrvaShell";
import {
  floorSlug,
  productsByCategory,
  storeHref,
  suggestProducts,
} from "@/lib/catalog";

export function HomePage() {
  const { floors, config, loading } = useCatalog();
  const router = useRouter();
  const picks = useMemo(() => suggestProducts(8, [], floors), [floors]);
  const foodPicks = useMemo(() => productsByCategory("food", 4, floors), [floors]);
  const foodStores = useMemo(
    () => floors.flatMap((f) => f.stores.filter((s) => s.category === "food")).slice(0, 6),
    [floors],
  );
  const boutiques = useMemo(
    () => floors.flatMap((f) => f.stores.filter((s) => s.featured)).slice(0, 8),
    [floors],
  );
  const floorCards = useMemo(
    () =>
      floors.map((f) => ({
        label: f.label,
        title: f.title,
        categoryName: f.categoryName,
        hero: f.heroImage ?? f.stores[0]?.doorImage ?? "",
        storeCount: f.stores.length,
      })),
    [floors],
  );

  return (
    <OrvaShell>
      <OrvaMarketingHome
        nestInShell
        config={config}
        floors={floorCards}
        boutiques={boutiques}
        picks={picks}
        foodPicks={foodPicks}
        foodStores={foodStores}
        loading={loading}
        onShop={(category) =>
          router.push(category ? `/shop?category=${category}` : "/shop")
        }
        onDirectory={() => router.push("/directory")}
        onFloors={() => router.push("/floors")}
        onFood={() => router.push("/food")}
        onOpenFloor={(i) => {
          const f = floors[i];
          if (f) router.push(`/floors/${floorSlug(f)}`);
        }}
        onOpenStore={(s) => router.push(storeHref(s))}
        onBuyNow={() => router.push("/checkout")}
      />
    </OrvaShell>
  );
}
