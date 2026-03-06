import { NextRequest, NextResponse } from "next/server";
import { getActivities } from "@/lib/sloane";

export async function GET(req: NextRequest) {
  const clientId = req.nextUrl.searchParams.get("clientId") || undefined;
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "50");
  
  const activities = getActivities(clientId, limit);
  return NextResponse.json({ activities });
}
