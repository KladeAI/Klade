export const metadata = { title: "Subprocessor List — Klade" };

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 lg:px-6 lg:py-14">
      <h1 className="text-2xl font-semibold text-white">Subprocessor List</h1>
      <p className="mt-2 text-sm text-[#b3bedf]">Last updated: 2026-03-23</p>
      <div className="prose prose-invert mt-6 max-w-none">
        <ul>
          <li><strong>Vercel</strong> — Hosting (US). Processes HTTP requests and logs. SOC 2 Type II, ISO 27001.</li>
          <li><strong>Supabase</strong> (if enabled) — Managed Postgres/Auth (US). No prompts by default.</li>
          <li><strong>OpenAI</strong> — LLM inference (US). Prompts in-memory only; not used for training.</li>
          <li><strong>Anthropic</strong> — LLM inference (US). Prompts in-memory only; not used for training.</li>
          <li><strong>GitHub</strong> — Source/CI (US). No client data.</li>
          <li><strong>Tailscale</strong> — Secure mesh networking for admin. No client prompts.</li>
        </ul>
        <p className="mt-6 text-[#9aa4cb]">We notify clients of material changes prior to adding new subprocessors.</p>
      </div>
    </main>
  );
}
