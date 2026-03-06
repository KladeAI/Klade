import { NextRequest, NextResponse } from "next/server";
import { processMessage, logActivity } from "@/lib/sloane";
import type { SloaneContext } from "@/lib/sloane";

export async function POST(req: NextRequest) {
  try {
    const { message, clientId, clientName, userName } = await req.json();

    if (!message || !clientId) {
      return NextResponse.json({ error: "Missing message or clientId" }, { status: 400 });
    }

    const context: SloaneContext = {
      clientId,
      clientName: clientName || "Client",
      userName: userName || "there",
      conversationHistory: [],
    };

    const response = await processMessage(message, context);

    // Log the activity
    logActivity({
      clientId,
      action: response.message,
      intent: response.intent,
      requiresApproval: response.requiresApproval,
      status: response.requiresApproval ? "pending_approval" : "completed",
    });

    return NextResponse.json(response);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
