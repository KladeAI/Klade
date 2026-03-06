/**
 * Sloane's Brain — Core AI Engine
 * 
 * Takes a user message + context, classifies intent,
 * selects the right tool, executes, and returns a response.
 */

export type Intent =
  | "calendar_view"
  | "calendar_create"
  | "email_draft"
  | "email_send"
  | "research"
  | "document_create"
  | "task_create"
  | "task_list"
  | "reminder"
  | "general_chat"
  | "unknown";

export interface SloaneMessage {
  role: "user" | "sloane";
  content: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface SloaneContext {
  clientId: string;
  clientName: string;
  userName: string;
  conversationHistory: SloaneMessage[];
  preferences?: Record<string, string>;
}

export interface SloaneResponse {
  message: string;
  intent: Intent;
  requiresApproval: boolean;
  pendingAction?: {
    type: string;
    description: string;
    payload: Record<string, unknown>;
  };
}

export const SLOANE_SYSTEM_PROMPT = `You are Sloane, an AI Executive Assistant employed by Cadre. You work for the client's company as a dedicated team member.

Your personality:
- Professional, warm, and proactive
- You think ahead and anticipate needs
- You're concise but thorough
- You never say "As an AI" — you're Sloane, their executive assistant
- You use a natural, human tone (not robotic)

Your capabilities:
- Calendar management (view, create, modify events)
- Email drafting and sending (always draft first, send only with approval)
- Web research and competitive intelligence
- Document creation (meeting notes, memos, briefs)
- Task tracking and reminders
- Meeting preparation and briefings

Rules:
- NEVER send an email without explicit approval
- NEVER share information between different clients
- If you're unsure about something, ask for clarification
- Proactively suggest next steps when completing a task
- Keep responses concise in Slack (expand when asked)

When classifying the user's request, identify the primary intent and respond accordingly. If a task requires using a tool, describe what you'll do and execute it.`;

/**
 * Classify user intent from their message.
 * In production this would use the LLM — for MVP we use keyword matching
 * with LLM fallback for complex cases.
 */
export function classifyIntent(message: string): Intent {
  const lower = message.toLowerCase();

  // Calendar
  if (lower.match(/\b(schedule|meeting|calendar|book|appointment|availability|free time|when am i)\b/)) {
    if (lower.match(/\b(schedule|book|create|set up|arrange)\b/)) return "calendar_create";
    return "calendar_view";
  }

  // Email
  if (lower.match(/\b(email|mail|send|draft|write to|reply to|respond to)\b/)) {
    if (lower.match(/\b(send|fire off|shoot)\b/) && !lower.match(/\b(draft|write)\b/)) return "email_send";
    return "email_draft";
  }

  // Research
  if (lower.match(/\b(research|look up|find out|what is|who is|tell me about|analyze|analysis|competitor|compare)\b/)) {
    return "research";
  }

  // Documents
  if (lower.match(/\b(write|create|draft|prepare|document|memo|brief|notes|report|summary)\b/)) {
    return "document_create";
  }

  // Tasks
  if (lower.match(/\b(task|todo|to-do|remind|reminder|follow up|track|deadline)\b/)) {
    if (lower.match(/\b(list|show|what|pending|status)\b/)) return "task_list";
    return "task_create";
  }

  // Reminder
  if (lower.match(/\b(remind me|don't forget|remember to)\b/)) {
    return "reminder";
  }

  return "general_chat";
}

/**
 * Determine if an action requires human approval before execution.
 */
export function requiresApproval(intent: Intent): boolean {
  const approvalRequired: Intent[] = [
    "email_send",
    "calendar_create",
  ];
  return approvalRequired.includes(intent);
}

/**
 * Build Sloane's response. In production, this calls the LLM.
 * For MVP, this is the orchestration layer that will be wired to real APIs.
 */
export async function processMessage(
  userMessage: string,
  context: SloaneContext
): Promise<SloaneResponse> {
  const intent = classifyIntent(userMessage);
  const needsApproval = requiresApproval(intent);

  // For MVP: return structured responses by intent
  // In production: each intent routes to a tool executor + LLM for natural language
  const responses: Record<Intent, () => SloaneResponse> = {
    calendar_view: () => ({
      message: `Let me pull up your calendar. One moment, ${context.userName}...`,
      intent,
      requiresApproval: false,
    }),
    calendar_create: () => ({
      message: `I'll set that up for you. Let me find the best time and I'll send you a confirmation to approve before it goes out.`,
      intent,
      requiresApproval: true,
      pendingAction: {
        type: "calendar_create",
        description: "Create calendar event",
        payload: { rawRequest: userMessage },
      },
    }),
    email_draft: () => ({
      message: `I'll draft that email for you. Give me a moment and I'll have it ready for your review.`,
      intent,
      requiresApproval: false,
    }),
    email_send: () => ({
      message: `I've prepared the email. I'll need your approval before sending — check your dashboard to review and approve.`,
      intent,
      requiresApproval: true,
      pendingAction: {
        type: "email_send",
        description: "Send email (requires approval)",
        payload: { rawRequest: userMessage },
      },
    }),
    research: () => ({
      message: `On it. I'll research that and have a summary ready for you shortly.`,
      intent,
      requiresApproval: false,
    }),
    document_create: () => ({
      message: `I'll put that together for you. What format works best — a quick memo, a detailed brief, or bullet points?`,
      intent,
      requiresApproval: false,
    }),
    task_create: () => ({
      message: `Got it — I've added that to your task list. I'll remind you when it's coming up. Anything else?`,
      intent,
      requiresApproval: false,
    }),
    task_list: () => ({
      message: `Here are your current tasks. Let me pull those up...`,
      intent,
      requiresApproval: false,
    }),
    reminder: () => ({
      message: `Reminder set. I won't let you forget.`,
      intent,
      requiresApproval: false,
    }),
    general_chat: () => ({
      message: `Of course! How can I help you with that, ${context.userName}?`,
      intent,
      requiresApproval: false,
    }),
    unknown: () => ({
      message: `I'm not sure I follow — could you rephrase that? I'm here to help with calendar, email, research, docs, and task management.`,
      intent,
      requiresApproval: false,
    }),
  };

  return responses[intent]();
}
