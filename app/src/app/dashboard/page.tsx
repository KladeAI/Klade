"use client";

import { useState, useRef, useEffect } from "react";

interface ChatMessage {
  role: "user" | "sloane";
  content: string;
  timestamp: string;
  intent?: string;
  requiresApproval?: boolean;
}

interface Activity {
  id: string;
  action: string;
  intent: string;
  timestamp: string;
  requiresApproval: boolean;
  status: string;
}

const navItems = [
  { label: "Dashboard", icon: "📊", active: true },
  { label: "Employees", icon: "👥", active: false },
  { label: "Activity Log", icon: "📋", active: false },
  { label: "Integrations", icon: "🔌", active: false },
  { label: "Billing", icon: "💳", active: false },
  { label: "Settings", icon: "⚙️", active: false },
];

export default function Dashboard() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "sloane",
      content: "Good morning! I'm Sloane, your executive assistant. How can I help you today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Poll activities
  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch("/api/sloane/activity?clientId=demo-client&limit=10");
        const data = await res.json();
        if (data.activities) setActivities(data.activities);
      } catch { /* ignore */ }
    };
    poll();
    const interval = setInterval(poll, 5000);
    return () => clearInterval(interval);
  }, []);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/sloane/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          clientId: "demo-client",
          clientName: "Demo Company",
          userName: "Arjun",
        }),
      });
      const data = await res.json();

      const sloaneMsg: ChatMessage = {
        role: "sloane",
        content: data.message,
        timestamp: new Date().toISOString(),
        intent: data.intent,
        requiresApproval: data.requiresApproval,
      };
      setMessages((prev) => [...prev, sloaneMsg]);

      // Refresh activities
      const actRes = await fetch("/api/sloane/activity?clientId=demo-client&limit=10");
      const actData = await actRes.json();
      if (actData.activities) setActivities(actData.activities);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "sloane", content: "Sorry, something went wrong. Let me try again.", timestamp: new Date().toISOString() },
      ]);
    }
    setLoading(false);
  }

  function formatTime(ts: string) {
    return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[var(--card-border)] bg-[var(--card)] p-6 flex flex-col shrink-0">
        <div className="mb-8">
          <span className="text-xl font-bold tracking-tight">cadre</span>
          <p className="text-xs text-[var(--muted)] mt-1">Client Portal</p>
        </div>
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                item.active
                  ? "bg-[var(--accent)]/10 text-[var(--accent-light)]"
                  : "text-[var(--muted)] hover:text-white hover:bg-zinc-800"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="pt-6 border-t border-[var(--card-border)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-sm font-bold">
              A
            </div>
            <div>
              <p className="text-sm font-medium">Demo Company</p>
              <p className="text-xs text-[var(--muted)]">Premium Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Chat Panel */}
        <main className="flex-1 flex flex-col border-r border-[var(--card-border)]">
          {/* Header */}
          <div className="p-4 border-b border-[var(--card-border)] flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent)] to-purple-500 flex items-center justify-center text-sm font-bold">
              B
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold">Sloane</h2>
                <span className="inline-flex items-center gap-1 text-xs text-[var(--success)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
                  Online
                </span>
              </div>
              <p className="text-xs text-[var(--muted)]">Executive Assistant</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm ${
                    msg.role === "user"
                      ? "bg-[var(--accent)] text-white rounded-br-md"
                      : "bg-[var(--card)] border border-[var(--card-border)] rounded-bl-md"
                  }`}
                >
                  <p>{msg.content}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] opacity-50">{formatTime(msg.timestamp)}</span>
                    {msg.intent && msg.role === "sloane" && (
                      <span className="text-[10px] opacity-40 bg-white/10 px-1.5 py-0.5 rounded">
                        {msg.intent}
                      </span>
                    )}
                    {msg.requiresApproval && (
                      <span className="text-[10px] text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded">
                        ⚠ Needs approval
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[var(--card)] border border-[var(--card-border)] px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-[var(--muted)] animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-[var(--muted)] animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-[var(--muted)] animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="p-4 border-t border-[var(--card-border)]">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Sloane anything..."
                className="flex-1 px-4 py-3 rounded-xl bg-[var(--card)] border border-[var(--card-border)] text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-sm"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-[var(--accent)] hover:bg-[var(--accent-light)] text-white font-medium px-5 py-3 rounded-xl transition-colors text-sm disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </form>
        </main>

        {/* Activity Sidebar */}
        <aside className="w-80 p-4 overflow-y-auto shrink-0 hidden lg:block">
          <h3 className="text-sm font-medium text-[var(--muted)] uppercase tracking-wider mb-4">Live Activity</h3>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-3 rounded-xl border border-[var(--card-border)] bg-[var(--card)] text-center">
              <p className="text-lg font-bold">{activities.length}</p>
              <p className="text-[10px] text-[var(--muted)]">Actions today</p>
            </div>
            <div className="p-3 rounded-xl border border-[var(--card-border)] bg-[var(--card)] text-center">
              <p className="text-lg font-bold">{activities.filter((a) => a.status === "pending_approval").length}</p>
              <p className="text-[10px] text-[var(--muted)]">Pending approval</p>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="space-y-2">
            {activities.length === 0 && (
              <p className="text-sm text-[var(--muted)] text-center py-8">
                Chat with Sloane to see activity here
              </p>
            )}
            {activities.map((act) => (
              <div
                key={act.id}
                className="p-3 rounded-lg border border-[var(--card-border)] bg-[var(--card)]"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs leading-relaxed">{act.action}</p>
                  {act.status === "pending_approval" && (
                    <span className="shrink-0 text-[10px] text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded">
                      Pending
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] text-[var(--muted)]">{formatTime(act.timestamp)}</span>
                  <span className="text-[10px] text-[var(--muted)] opacity-50">{act.intent}</span>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
