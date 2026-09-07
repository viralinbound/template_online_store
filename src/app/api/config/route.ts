import { NextResponse } from "next/server";
import { loadCatalog } from "@/lib/data/repository";

export async function GET() {
  try {
    const catalog = await loadCatalog();
    return NextResponse.json(catalog.config);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Config load failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
