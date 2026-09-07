import { Suspense } from "react";
import { ShopPage } from "@/components/pages/ShopPage";

export default function ShopRoute() {
  return (
    <Suspense fallback={<p className="page-loading">Loading shop…</p>}>
      <ShopPage />
    </Suspense>
  );
}
