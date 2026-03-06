/**
 * Slack Integration Connector
 * 
 * Enables AI employees to:
 * - Join client Slack workspaces
 * - Send/receive messages
 * - React to messages
 * - Read channel history
 * - Post in threads
 */

import type { IntegrationConnector, IntegrationAction, ClientIntegration, IntegrationResult } from "../types";

export const SlackConnector: IntegrationConnector = {
  definition: {
    id: "slack",
    name: "Slack",
    category: "communication",
    description: "Connect your Slack workspace so AI employees can communicate with your team directly.",
    icon: "💬",
    authType: "oauth2",
    requiredScopes: [
      "channels:read",
      "channels:history",
      "chat:write",
      "im:read",
      "im:write",
      "im:history",
      "users:read",
      "reactions:write",
    ],
  },

  async testConnection(integration: ClientIntegration): Promise<{ ok: boolean; error?: string }> {
    // TODO: Call Slack API auth.test with the stored token
    if (!integration.credentials.bot_token) {
      return { ok: false, error: "Missing bot token" };
    }
    // Mock success for now
    return { ok: true };
  },

  getActions(): IntegrationAction[] {
    return [
      {
        id: "send_message",
        name: "Send Message",
        description: "Send a message to a Slack channel or DM",
        requiresApproval: false,
        params: [
          { key: "channel", type: "string", required: true, description: "Channel ID or user ID" },
          { key: "text", type: "string", required: true, description: "Message text" },
          { key: "thread_ts", type: "string", required: false, description: "Thread timestamp for replies" },
        ],
      },
      {
        id: "read_channel",
        name: "Read Channel History",
        description: "Read recent messages from a channel",
        requiresApproval: false,
        params: [
          { key: "channel", type: "string", required: true, description: "Channel ID" },
          { key: "limit", type: "number", required: false, description: "Number of messages (default 20)" },
        ],
      },
      {
        id: "list_channels",
        name: "List Channels",
        description: "List all channels the bot has access to",
        requiresApproval: false,
        params: [],
      },
      {
        id: "react",
        name: "Add Reaction",
        description: "Add an emoji reaction to a message",
        requiresApproval: false,
        params: [
          { key: "channel", type: "string", required: true, description: "Channel ID" },
          { key: "timestamp", type: "string", required: true, description: "Message timestamp" },
          { key: "emoji", type: "string", required: true, description: "Emoji name without colons" },
        ],
      },
    ];
  },

  async execute(
    _integration: ClientIntegration,
    action: string,
    params: Record<string, unknown>
  ): Promise<IntegrationResult> {
    // TODO: Wire to real Slack API calls using @slack/web-api
    switch (action) {
      case "send_message":
        return {
          success: true,
          data: { channel: params.channel, ts: Date.now().toString() },
          message: `Message sent to ${params.channel}`,
        };
      case "read_channel":
        return {
          success: true,
          data: { messages: [], channel: params.channel },
          message: `Read ${params.limit || 20} messages from channel`,
        };
      case "list_channels":
        return {
          success: true,
          data: { channels: [] },
          message: "Listed channels",
        };
      case "react":
        return {
          success: true,
          data: { ok: true },
          message: `Added :${params.emoji}: reaction`,
        };
      default:
        return { success: false, message: `Unknown action: ${action}` };
    }
  },
};
