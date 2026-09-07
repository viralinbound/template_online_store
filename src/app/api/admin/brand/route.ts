import { NextResponse } from "next/server";
import { adminUpdateBrandKit } from "@/lib/data/adminCatalog";

function checkKey(request: Request) {
  const required = process.env.MALL_INGEST_KEY;
  if (!required) return null;
  const got = request.headers.get("x-mall-ingest-key") || request.headers.get("x-orva-admin-key");
  if (got !== required) {
    return NextResponse.json({ error: "Unauthorized — set x-orva-admin-key" }, { status: 401 });
  }
  return null;
}

/** PATCH brand kit — name, logo, colors — storefront updates automatically */
export async function PATCH(request: Request) {
  const denied = checkKey(request);
  if (denied) return denied;
  try {
    const body = await request.json();
    const result = await adminUpdateBrandKit(body ?? {});
    return NextResponse.json({
      ok: true,
      config: result.config,
      message: "Brand kit saved — full website updates automatically.",
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Brand update failed" },
      { status: 400 },
    );
  }
}

export async function GET(request: Request) {
  const denied = checkKey(request);
  if (denied) return denied;
  try {
    const { loadCatalog } = await import("@/lib/data/repository");
    const payload = await loadCatalog(true);
    return NextResponse.json({ ok: true, config: payload.config });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load brand" },
      { status: 500 },
    );
  }
}
