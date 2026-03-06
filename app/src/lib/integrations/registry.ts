/**
 * Integration Registry
 * 
 * Central registry of all available integrations.
 * When a client onboards, they pick which integrations to connect.
 * AI employees automatically gain access to connected integrations.
 */

import type { IntegrationDefinition, IntegrationConnector, ClientIntegration } from "./types";
import { SlackConnector } from "./connectors/slack";
import { GoogleCalendarConnector } from "./connectors/google-calendar";
import { GmailConnector } from "./connectors/gmail";
import { GoogleDriveConnector } from "./connectors/google-drive";

/** All available integration definitions */
export const INTEGRATIONS: IntegrationDefinition[] = [
  SlackConnector.definition,
  GoogleCalendarConnector.definition,
  GmailConnector.definition,
  GoogleDriveConnector.definition,
];

/** Map of integration ID → connector instance */
const connectors: Map<string, IntegrationConnector> = new Map([
  ["slack", SlackConnector],
  ["google-calendar", GoogleCalendarConnector],
  ["gmail", GmailConnector],
  ["google-drive", GoogleDriveConnector],
]);

/** Get a connector by integration ID */
export function getConnector(integrationId: string): IntegrationConnector | undefined {
  return connectors.get(integrationId);
}

/** Get all available integrations */
export function getAvailableIntegrations(): IntegrationDefinition[] {
  return INTEGRATIONS;
}

/** Get integrations by category */
export function getIntegrationsByCategory(category: string): IntegrationDefinition[] {
  return INTEGRATIONS.filter((i) => i.category === category);
}

// ============================================
// Client Integration Store (in-memory for MVP)
// ============================================
const clientIntegrations: Map<string, ClientIntegration[]> = new Map();

export function getClientIntegrations(clientId: string): ClientIntegration[] {
  return clientIntegrations.get(clientId) || [];
}

export function addClientIntegration(integration: ClientIntegration): void {
  const existing = clientIntegrations.get(integration.clientId) || [];
  existing.push(integration);
  clientIntegrations.set(integration.clientId, existing);
}

export function removeClientIntegration(clientId: string, integrationId: string): void {
  const existing = clientIntegrations.get(clientId) || [];
  clientIntegrations.set(
    clientId,
    existing.filter((i) => i.integrationId !== integrationId)
  );
}

/**
 * Execute an action on a client's connected integration.
 * This is the main entry point AI employees use to interact with tools.
 */
export async function executeIntegration(
  clientId: string,
  integrationId: string,
  action: string,
  params: Record<string, unknown>
) {
  const clientIntgs = getClientIntegrations(clientId);
  const integration = clientIntgs.find((i) => i.integrationId === integrationId);

  if (!integration) {
    return { success: false, message: `Integration ${integrationId} not connected for this client` };
  }

  if (integration.status !== "connected") {
    return { success: false, message: `Integration ${integrationId} is ${integration.status}` };
  }

  const connector = getConnector(integrationId);
  if (!connector) {
    return { success: false, message: `No connector found for ${integrationId}` };
  }

  // Update last used
  integration.lastUsed = new Date().toISOString();

  return connector.execute(integration, action, params);
}
