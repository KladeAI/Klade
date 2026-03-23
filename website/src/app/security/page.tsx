import Link from "next/link";

export const metadata = {
  title: "Trust Center — Klade",
  description: "Security, privacy, and compliance at Klade: zero data access by default, token-only metering, no prompt storage, and a clear SOC 2 roadmap.",
};

export default function TrustCenterPage() {
  return (
    <main className="relative z-10">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-12 lg:px-6 lg:pt-16">
        <div className="hero-shell premium-sheen rounded-xl p-6 sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Trust Center
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#b3bedf]">
                Security is the product. Klade is built with data minimization by default: zero data access, token-only metering, no prompt storage — and no public ports on internal systems.
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#c8d3f0]">
              <div className="font-medium">Compliance roadmap</div>
              <div className="text-[#9aa4cb]">SOC 2 Type I in progress</div>
            </div>
          </div>
        </div>
      </section>

      {/* Content grid */}
      <section className="mx-auto max-w-6xl px-4 py-10 lg:px-6 lg:py-14">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Architecture */}
            <article className="surface-card rounded-xl p-5 sm:p-6">
              <h2 className="text-xl font-semibold text-white">Security Architecture</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#c8d3f0]">
                <li>Zero data access by default — client prompts are not stored server-side</li>
                <li>Token-only metering — usage recorded without retaining raw text</li>
                <li>LLM providers (OpenAI, Anthropic) via APIs that do not use client data for training</li>
                <li>Admin access via Tailscale only; no public ports on internal systems</li>
                <li>Production behind managed edge (e.g., Vercel) with TLS enforced</li>
              </ul>
            </article>

            {/* Data handling */}
            <article className="surface-card rounded-xl p-5 sm:p-6">
              <h2 className="text-xl font-semibold text-white">Data Handling</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#c8d3f0]">
                <li>Minimization: we collect only what is necessary to provide the service</li>
                <li>No prompt/output retention by default; feature-gated persistence is explicit</li>
                <li>Logs exclude sensitive payloads by design</li>
                <li>US data residency by default</li>
                <li>Data subject requests honored within 30 days</li>
              </ul>
            </article>

            {/* Encryption */}
            <article className="surface-card rounded-xl p-5 sm:p-6">
              <h2 className="text-xl font-semibold text-white">Encryption</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#c8d3f0]">
                <li>In transit: TLS 1.2+ for all external traffic</li>
                <li>At rest: provider-managed encryption (databases, object storage)</li>
                <li>Keys: provider-managed KMS; CMK support under review for post–SOC 2</li>
              </ul>
            </article>

            {/* Infrastructure */}
            <article className="surface-card rounded-xl p-5 sm:p-6">
              <h2 className="text-xl font-semibold text-white">Infrastructure Security</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#c8d3f0]">
                <li>Localhost-first design; no public ports on internal machines</li>
                <li>Tailscale mesh for secure administrative access</li>
                <li>Principle of least privilege for all accounts</li>
                <li>Dependency updates and PR-based change control</li>
              </ul>
            </article>

            {/* Roadmap */}
            <article className="surface-card rounded-xl p-5 sm:p-6">
              <h2 className="text-xl font-semibold text-white">Compliance Roadmap</h2>
              <p className="mt-3 text-sm text-[#c8d3f0]">
                Target: SOC 2 Type I following first paid client. Penetration test scheduled prior to audit. Type II observation begins immediately after Type I.
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#c8d3f0]">
                <li>Phase 0 (now): public documentation and no-cost controls live</li>
                <li>Phase 1: policy formalization, training, logging/SAST, risk assessment</li>
                <li>Phase 2: pen test, SOC 2 Type I audit, insurance</li>
              </ul>
            </article>

            {/* Docs links */}
            <article className="surface-card rounded-xl p-5 sm:p-6">
              <h2 className="text-xl font-semibold text-white">Security Documents</h2>
              <ul className="mt-3 grid gap-2 text-sm text-[#c8d3f0]">
                <li>
                  <Link href="/docs/security/klade-security-questionnaire" className="text-[#4fd1ff] hover:underline">
                    Pre-filled Security Questionnaire
                  </Link>
                </li>
                <li>
                  <Link href="/docs/security/subprocessor-list" className="text-[#4fd1ff] hover:underline">
                    Subprocessor List
                  </Link>
                </li>
                <li>
                  <Link href="/docs/security/data-flow" className="text-[#4fd1ff] hover:underline">
                    Data Flow Diagram (text)
                  </Link>
                </li>
              </ul>
            </article>
          </div>

          {/* Right column */}
          <aside className="space-y-6">
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
              <div className="text-sm font-medium text-white">Questions?</div>
              <div className="mt-1 text-sm text-[#c8d3f0]">
                Email <a href="mailto:security@kladeai.com" className="text-[#4fd1ff] hover:underline">security@kladeai.com</a> for security reviews and questionnaires.
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
              <div className="text-sm font-medium text-white">Status</div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#c8d3f0]">
                <li>Prompts not stored by default</li>
                <li>MFA enforced for all founder accounts</li>
                <li>Admin via Tailscale only</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
