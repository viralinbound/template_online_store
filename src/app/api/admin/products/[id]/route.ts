import { NextResponse } from "next/server";
import { adminDeleteProduct, adminUpsertProduct } from "@/lib/data/adminCatalog";

type Ctx = { params: Promise<{ id: string }> };

function checkKey(request: Request) {
  const required = process.env.MALL_INGEST_KEY;
  if (!required) return null;
  const got = request.headers.get("x-mall-ingest-key") || request.headers.get("x-orva-admin-key");
  if (got !== required) {
    return NextResponse.json({ error: "Unauthorized — set x-orva-admin-key" }, { status: 401 });
  }
  return null;
}

export async function PATCH(request: Request, ctx: Ctx) {
  const denied = checkKey(request);
  if (denied) return denied;
  try {
    const { id } = await ctx.params;
    const body = await request.json();
    const result = await adminUpsertProduct({ ...body, id });
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Update failed" },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request, ctx: Ctx) {
  const denied = checkKey(request);
  if (denied) return denied;
  try {
    const { id } = await ctx.params;
    const result = await adminDeleteProduct(id);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Delete failed" },
      { status: 400 },
    );
  }
}
