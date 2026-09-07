import { Suspense } from "react";
import { HelpPage } from "@/components/pages/HelpPage";

export default function HelpRoute() {
  return (
    <Suspense fallback={<p className="page-loading">Loading help…</p>}>
      <HelpPage />
    </Suspense>
  );
}
