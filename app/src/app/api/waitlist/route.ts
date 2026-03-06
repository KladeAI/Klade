import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const WAITLIST_PATH = path.join(process.cwd(), "waitlist.json");

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    let waitlist: { email: string; timestamp: string }[] = [];
    try {
      const data = await fs.readFile(WAITLIST_PATH, "utf-8");
      waitlist = JSON.parse(data);
    } catch {
      // File doesn't exist yet, start fresh
    }

    // Deduplicate
    if (waitlist.some((entry) => entry.email === email)) {
      return NextResponse.json({ message: "Already on the list" });
    }

    waitlist.push({ email, timestamp: new Date().toISOString() });
    await fs.writeFile(WAITLIST_PATH, JSON.stringify(waitlist, null, 2));

    return NextResponse.json({ message: "Added to waitlist" });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
