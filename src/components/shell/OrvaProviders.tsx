"use client";

import { CatalogProvider } from "@/components/CatalogProvider";
import type { ReactNode } from "react";

export function OrvaProviders({ children }: { children: ReactNode }) {
  return <CatalogProvider>{children}</CatalogProvider>;
}
