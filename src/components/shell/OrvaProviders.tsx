"use client";

import { CatalogProvider } from "@/components/CatalogProvider";
import { LayoutGroup } from "framer-motion";
import type { ReactNode } from "react";

export function OrvaProviders({ children }: { children: ReactNode }) {
  return (
    <CatalogProvider>
      <LayoutGroup id="orva-mall">{children}</LayoutGroup>
    </CatalogProvider>
  );
}
