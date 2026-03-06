/**
 * Sloane — Main Entry Point
 * 
 * Orchestrates intent classification → tool execution → response generation.
 */

export { processMessage, classifyIntent, requiresApproval, SLOANE_SYSTEM_PROMPT } from "./brain";
export type { SloaneMessage, SloaneContext, SloaneResponse, Intent } from "./brain";

export {
  getCalendarEvents,
  createCalendarEvent,
  draftEmail,
  sendEmail,
  doResearch,
  createTask,
  listTasks,
  logActivity,
  getActivities,
} from "./tools";
export type { CalendarEvent, EmailDraft, ResearchResult, Task, ActivityEntry, ToolResult } from "./tools";
