export const metadata = { title: "Security Questionnaire — Klade" };

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 lg:px-6 lg:py-14">
      <h1 className="text-2xl font-semibold text-white">Klade Security Questionnaire (Pre-Filled)</h1>
      <p className="mt-2 text-sm text-[#b3bedf]">Last updated: 2026-03-23</p>
      <div className="prose prose-invert mt-6 max-w-none">
        <p>
          This page summarizes our standard responses to common enterprise security questionnaires. For a signed PDF or vendor-specific formats, email security@kladeai.com.
        </p>
        <h2>Highlights</h2>
        <ul>
          <li>Zero data access by default — prompts are not stored server-side</li>
          <li>Token-only metering; no raw text retention</li>
          <li>MFA enforced for all founder accounts</li>
          <li>Admin via Tailscale; no public ports</li>
          <li>SOC 2 Type I planned post-revenue; pen test prior to audit</li>
        </ul>
        <p className="mt-6 text-[#9aa4cb]">
          Full detailed questionnaire is maintained in our security docs repository and provided on request.
        </p>
      </div>
    </main>
  );
}
