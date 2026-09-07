"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Legacy /explore → mall floors journey (one website experience) */
export function ExplorePage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/floors");
  }, [router]);
  return (
    <p className="page-loading" style={{ padding: "2rem" }}>
      Opening mall floors…
    </p>
  );
}
