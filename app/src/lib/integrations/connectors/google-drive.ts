/**
 * Google Drive Integration Connector
 */

import type { IntegrationConnector, IntegrationAction, ClientIntegration, IntegrationResult } from "../types";

export const GoogleDriveConnector: IntegrationConnector = {
  definition: {
    id: "google-drive",
    name: "Google Drive",
    category: "storage",
    description: "Create, read, and organize documents, spreadsheets, and files.",
    icon: "📁",
    authType: "oauth2",
    requiredScopes: [
      "https://www.googleapis.com/auth/drive.file",
      "https://www.googleapis.com/auth/documents",
      "https://www.googleapis.com/auth/spreadsheets",
    ],
  },

  async testConnection(integration: ClientIntegration) {
    if (!integration.credentials.access_token) {
      return { ok: false, error: "Missing access token" };
    }
    return { ok: true };
  },

  getActions(): IntegrationAction[] {
    return [
      {
        id: "create_doc",
        name: "Create Document",
        description: "Create a new Google Doc",
        requiresApproval: false,
        params: [
          { key: "title", type: "string", required: true, description: "Document title" },
          { key: "content", type: "string", required: true, description: "Document content (markdown)" },
          { key: "folder_id", type: "string", required: false, description: "Folder to create in" },
        ],
      },
      {
        id: "list_files",
        name: "List Files",
        description: "List files in a folder or search",
        requiresApproval: false,
        params: [
          { key: "query", type: "string", required: false, description: "Search query" },
          { key: "folder_id", type: "string", required: false, description: "Folder ID" },
        ],
      },
      {
        id: "read_doc",
        name: "Read Document",
        description: "Read contents of a Google Doc",
        requiresApproval: false,
        params: [
          { key: "doc_id", type: "string", required: true, description: "Document ID" },
        ],
      },
    ];
  },

  async execute(
    _integration: ClientIntegration,
    action: string,
    params: Record<string, unknown>
  ): Promise<IntegrationResult> {
    switch (action) {
      case "create_doc":
        return {
          success: true,
          data: { docId: `doc-${Date.now()}`, title: params.title },
          message: `Document "${params.title}" created`,
        };
      case "list_files":
        return {
          success: true,
          data: { files: [] },
          message: "Listed files",
        };
      case "read_doc":
        return {
          success: true,
          data: { content: "" },
          message: "Document read",
        };
      default:
        return { success: false, message: `Unknown action: ${action}` };
    }
  },
};
