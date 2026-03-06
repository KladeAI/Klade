/**
 * Gmail Integration Connector
 */

import type { IntegrationConnector, IntegrationAction, ClientIntegration, IntegrationResult } from "../types";

export const GmailConnector: IntegrationConnector = {
  definition: {
    id: "gmail",
    name: "Gmail",
    category: "email",
    description: "Draft and send emails, read inbox, manage threads.",
    icon: "✉️",
    authType: "oauth2",
    requiredScopes: [
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/gmail.send",
      "https://www.googleapis.com/auth/gmail.compose",
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
        id: "read_inbox",
        name: "Read Inbox",
        description: "Get recent emails from inbox",
        requiresApproval: false,
        params: [
          { key: "limit", type: "number", required: false, description: "Number of emails (default 10)" },
          { key: "query", type: "string", required: false, description: "Search query" },
        ],
      },
      {
        id: "draft_email",
        name: "Draft Email",
        description: "Create an email draft for review",
        requiresApproval: false,
        params: [
          { key: "to", type: "string", required: true, description: "Recipient email" },
          { key: "subject", type: "string", required: true, description: "Email subject" },
          { key: "body", type: "string", required: true, description: "Email body (HTML or plain text)" },
          { key: "cc", type: "string[]", required: false, description: "CC recipients" },
        ],
      },
      {
        id: "send_email",
        name: "Send Email",
        description: "Send an email (requires approval)",
        requiresApproval: true,
        params: [
          { key: "to", type: "string", required: true, description: "Recipient email" },
          { key: "subject", type: "string", required: true, description: "Email subject" },
          { key: "body", type: "string", required: true, description: "Email body" },
        ],
      },
      {
        id: "reply_email",
        name: "Reply to Email",
        description: "Reply to an existing email thread (requires approval)",
        requiresApproval: true,
        params: [
          { key: "thread_id", type: "string", required: true, description: "Thread ID to reply to" },
          { key: "body", type: "string", required: true, description: "Reply body" },
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
      case "read_inbox":
        return {
          success: true,
          data: { emails: [] },
          message: `Read ${params.limit || 10} emails`,
        };
      case "draft_email":
        return {
          success: true,
          data: { draftId: `draft-${Date.now()}`, to: params.to, subject: params.subject },
          message: `Email draft created to ${params.to}`,
        };
      case "send_email":
        return {
          success: true,
          data: { messageId: `msg-${Date.now()}`, status: "pending_approval" },
          message: `Email to ${params.to} queued (pending approval)`,
        };
      case "reply_email":
        return {
          success: true,
          data: { messageId: `msg-${Date.now()}`, status: "pending_approval" },
          message: "Reply queued (pending approval)",
        };
      default:
        return { success: false, message: `Unknown action: ${action}` };
    }
  },
};
