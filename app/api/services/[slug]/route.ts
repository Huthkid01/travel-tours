import { fetchServiceBySlug } from "@/services/cms";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const service = await fetchServiceBySlug(slug);
    if (!service) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(service);
  } catch {
    return NextResponse.json({ error: "Failed to load service" }, { status: 500 });
  }
}
