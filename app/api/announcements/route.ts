import { fetchAnnouncements } from "@/services/cms";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const items = await fetchAnnouncements();
    return NextResponse.json(items);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
