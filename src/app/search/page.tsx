import { Suspense } from "react";
import { SearchPage } from "@/components/pages/SearchPage";

export default function SearchRoute() {
  return (
    <Suspense fallback={<p className="page-loading">Loading search…</p>}>
      <SearchPage />
    </Suspense>
  );
}
