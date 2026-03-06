/**
 * Cadre Integration Framework — Type Definitions
 * 
 * Every integration follows the same interface pattern.
 * This is what makes Cadre "plug and play" — standardized connectors
 * that any AI employee can use.
 */

/** Supported integration categories */
export type IntegrationCategory =
  | "communication"   // Slack, Discord, Teams, email
  | "calendar"        // Google Calendar, Outlook, Calendly
  | "email"           // Gmail, Outlook, custom SMTP
  | "storage"         // Google Drive, Dropbox, Notion
  | "crm"            // HubSpot, Salesforce, Pipedrive
  | "project"        // Linear, Asana, Jira, Monday
  | "finance"        // QuickBooks, Xero, Stripe
  | "custom";        // Client-specific integrations

/** Connection status for a client's integration */
export type ConnectionStatus = "connected" | "disconnected" | "pending" | "error";

/** Base integration definition */
export interface IntegrationDefinition {
  id: string;
  name: string;
  category: IntegrationCategory;
  description: string;
  icon: string;
  authType: "oauth2" | "api_key" | "webhook" | "bot_token";
  requiredScopes?: string[];
  configFields?: ConfigField[];
}

export interface ConfigField {
  key: string;
  label: string;
  type: "text" | "password" | "url" | "select";
  required: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
}

/** A client's active connection to an integration */
export interface ClientIntegration {
  id: string;
  clientId: string;
  integrationId: string;
  status: ConnectionStatus;
  config: Record<string, string>;
  credentials: Record<string, string>; // encrypted in production
  connectedAt: string;
  lastUsed?: string;
}

/** Standard interface every integration connector must implement */
export interface IntegrationConnector {
  definition: IntegrationDefinition;
  
  /** Test if the connection is valid */
  testConnection(integration: ClientIntegration): Promise<{ ok: boolean; error?: string }>;
  
  /** Execute an action through this integration */
  execute(
    integration: ClientIntegration,
    action: string,
    params: Record<string, unknown>
  ): Promise<IntegrationResult>;
  
  /** List available actions for this integration */
  getActions(): IntegrationAction[];
}

export interface IntegrationAction {
  id: string;
  name: string;
  description: string;
  requiresApproval: boolean;
  params: { key: string; type: string; required: boolean; description: string }[];
}

export interface IntegrationResult {
  success: boolean;
  data?: unknown;
  message: string;
  error?: string;
}
