"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function ExplorePage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/floors");
  }, [router]);
  return null;
}
