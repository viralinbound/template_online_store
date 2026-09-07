import { NextResponse } from "next/server";
import { adminListProducts, adminUpsertProduct } from "@/lib/data/adminCatalog";

function checkKey(request: Request) {
  const required = process.env.MALL_INGEST_KEY;
  if (!required) return null;
  const got = request.headers.get("x-mall-ingest-key") || request.headers.get("x-orva-admin-key");
  if (got !== required) {
    return NextResponse.json({ error: "Unauthorized — set x-orva-admin-key" }, { status: 401 });
  }
  return null;
}

export async function GET(request: Request) {
  const denied = checkKey(request);
  if (denied) return denied;
  try {
    const data = await adminListProducts();
    return NextResponse.json({ ok: true, ...data });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to list products" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const denied = checkKey(request);
  if (denied) return denied;
  try {
    const body = await request.json();
    if (!body?.name || body.price == null) {
      return NextResponse.json({ error: "name and price are required" }, { status: 400 });
    }
    const result = await adminUpsertProduct(body);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Create failed" },
      { status: 400 },
    );
  }
}
