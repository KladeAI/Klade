export const metadata = { title: "Data Flow — Klade" };

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 lg:px-6 lg:py-14">
      <h1 className="text-2xl font-semibold text-white">Data Flow</h1>
      <p className="mt-2 text-sm text-[#b3bedf]">How client data moves through Klade (Phase 0)</p>
      <div className="prose prose-invert mt-6 max-w-none">
        <ol>
          <li>Client &rarr; HTTPS &rarr; Klade API (edge/serverless)</li>
          <li>API &rarr; (optional redaction) &rarr; LLM provider (OpenAI/Anthropic)</li>
          <li>LLM &rarr; streamed result &rarr; API &rarr; HTTPS &rarr; Client</li>
          <li>Metering records tokens/time only; no raw prompt storage by default</li>
        </ol>
        <h2>Retention</h2>
        <p>Prompts/outputs are not persisted by default. Feature-gated storage is explicit and documented.</p>
        <h2>Encryption</h2>
        <p>TLS in transit; provider-managed encryption at rest for any stored data.</p>
      </div>
    </main>
  );
}
