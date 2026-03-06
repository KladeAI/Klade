/**
 * Google Calendar Integration Connector
 */

import type { IntegrationConnector, IntegrationAction, ClientIntegration, IntegrationResult } from "../types";

export const GoogleCalendarConnector: IntegrationConnector = {
  definition: {
    id: "google-calendar",
    name: "Google Calendar",
    category: "calendar",
    description: "Manage calendars, schedule meetings, and check availability.",
    icon: "📅",
    authType: "oauth2",
    requiredScopes: [
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/calendar.events",
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
        id: "list_events",
        name: "List Events",
        description: "Get upcoming calendar events",
        requiresApproval: false,
        params: [
          { key: "date", type: "string", required: false, description: "Date (YYYY-MM-DD), defaults to today" },
          { key: "days", type: "number", required: false, description: "Number of days to look ahead" },
        ],
      },
      {
        id: "create_event",
        name: "Create Event",
        description: "Schedule a new calendar event",
        requiresApproval: true,
        params: [
          { key: "title", type: "string", required: true, description: "Event title" },
          { key: "start", type: "string", required: true, description: "Start time (ISO 8601)" },
          { key: "end", type: "string", required: true, description: "End time (ISO 8601)" },
          { key: "attendees", type: "string[]", required: false, description: "Attendee email addresses" },
          { key: "location", type: "string", required: false, description: "Event location" },
          { key: "description", type: "string", required: false, description: "Event description" },
        ],
      },
      {
        id: "find_availability",
        name: "Find Availability",
        description: "Find free time slots across calendars",
        requiresApproval: false,
        params: [
          { key: "date", type: "string", required: true, description: "Date to check" },
          { key: "duration_minutes", type: "number", required: true, description: "Meeting duration" },
          { key: "attendees", type: "string[]", required: false, description: "Other attendees to check" },
        ],
      },
    ];
  },

  async execute(
    _integration: ClientIntegration,
    action: string,
    params: Record<string, unknown>
  ): Promise<IntegrationResult> {
    // TODO: Wire to Google Calendar API via googleapis
    switch (action) {
      case "list_events":
        return {
          success: true,
          data: { events: [] },
          message: `Listed events for ${params.date || "today"}`,
        };
      case "create_event":
        return {
          success: true,
          data: { eventId: `evt-${Date.now()}`, status: "pending_approval" },
          message: `Event "${params.title}" created (pending approval)`,
        };
      case "find_availability":
        return {
          success: true,
          data: { slots: ["09:00-09:30", "11:00-11:30", "14:00-14:30"] },
          message: "Found available time slots",
        };
      default:
        return { success: false, message: `Unknown action: ${action}` };
    }
  },
};
