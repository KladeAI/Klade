/**
 * Cadre Integration Framework
 * 
 * Plug-and-play integration system. Each connector follows the same interface.
 * To add a new integration:
 * 1. Create a connector in ./connectors/
 * 2. Implement IntegrationConnector interface
 * 3. Register in ./registry.ts
 * 
 * AI employees access integrations through executeIntegration() —
 * they don't need to know the implementation details.
 */

export type {
  IntegrationCategory,
  ConnectionStatus,
  IntegrationDefinition,
  ConfigField,
  ClientIntegration,
  IntegrationConnector,
  IntegrationAction,
  IntegrationResult,
} from "./types";

export {
  INTEGRATIONS,
  getConnector,
  getAvailableIntegrations,
  getIntegrationsByCategory,
  getClientIntegrations,
  addClientIntegration,
  removeClientIntegration,
  executeIntegration,
} from "./registry";
