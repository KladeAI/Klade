import { NextResponse } from "next/server";
import { getAvailableIntegrations, getConnector } from "@/lib/integrations";

export async function GET() {
  const integrations = getAvailableIntegrations();
  
  const enriched = integrations.map((intg) => {
    const connector = getConnector(intg.id);
    const actions = connector?.getActions() || [];
    return {
      ...intg,
      actions: actions.map((a) => ({
        id: a.id,
        name: a.name,
        description: a.description,
        requiresApproval: a.requiresApproval,
      })),
    };
  });

  return NextResponse.json({ integrations: enriched });
}
