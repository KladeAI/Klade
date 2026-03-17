"use client";

import { FadeIn } from "@/components/animated";
import { DocsCallout, DocsHeading, DocsSubheading, DocsText, TableOfContents } from "@/components/docs";

const tocItems = [
  { id: "isolation", label: "Client Isolation" },
  { id: "architecture", label: "Security Architecture" },
  { id: "data-handling", label: "Data Handling" },
  { id: "compliance", label: "Compliance Posture" },
];

export default function SecurityPage() {
  return (
    <div className="flex gap-10">
      <div className="min-w-0 flex-1">
        <FadeIn>
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#4fd1ff]">Trust & Security</p>
          <DocsHeading className="mt-4">Enterprise-Grade Isolation</DocsHeading>
          <DocsText className="mt-4 text-lg">
            Each client gets a dedicated, isolated Clay instance. Your data never touches another
            client&apos;s workspace. Built on NVIDIA NemoClaw-compatible architecture for enterprise
            sandbox deployment.
          </DocsText>
        </FadeIn>

        <FadeIn delay={0.05}>
          <DocsSubheading id="isolation">Client Isolation</DocsSubheading>
          <DocsText>
            Every Klade deployment runs as an isolated instance. There is no shared state, no shared
            data, and no shared compute between clients. Your Clay instance is yours alone — from
            the analytical engines to the data stores.
          </DocsText>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              { title: "Dedicated instances", desc: "Each client gets their own Clay deployment with isolated compute and storage." },
              { title: "No data commingling", desc: "Client data is never accessible to other clients, other models, or training pipelines." },
              { title: "Scoped access", desc: "Workflow-scoped permissions ensure Clay only accesses what your team authorizes." },
              { title: "Audit-ready", desc: "Complete audit logging of all requests, routing decisions, and outputs." },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-white/8 bg-white/4 p-4">
                <p className="text-sm font-medium text-white">{item.title}</p>
                <p className="mt-1.5 text-xs text-[#9aa4cb]">{item.desc}</p>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <DocsSubheading id="architecture">Security Architecture</DocsSubheading>
          <DocsText>
            Klade&apos;s architecture is built on a least-privilege model. Clay operates within explicitly
            defined boundaries — no ambient access, no broad permissions, no implicit trust. Every
            integration, every data connection, and every output channel is scoped and auditable.
          </DocsText>
          <DocsCallout type="info">
            Built on NVIDIA NemoClaw-compatible architecture, enabling enterprise sandbox deployment
            with hardware-level isolation for the most sensitive workloads.
          </DocsCallout>
        </FadeIn>

        <FadeIn delay={0.15}>
          <DocsSubheading id="data-handling">Data Handling</DocsSubheading>
          <DocsText>
            Your data is processed within your isolated instance and is never used to train models,
            shared with other clients, or retained beyond your specified data lifecycle policies.
          </DocsText>
          <div className="mt-4 space-y-2">
            {[
              "Client data is never used for model training",
              "No cross-client data access or sharing",
              "Configurable data retention policies",
              "Encrypted at rest and in transit",
              "No client-side secret storage",
            ].map((item) => (
              <p key={item} className="flex items-start gap-3 rounded-lg border border-white/8 bg-white/4 px-4 py-3 text-sm text-[#d8def5]">
                <span className="mt-0.5 text-[#4fd1ff]">✓</span>
                {item}
              </p>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <DocsSubheading id="compliance">Compliance Posture</DocsSubheading>
          <DocsText>
            Klade is designed to operate within regulated financial environments. Our security posture
            supports the compliance requirements of investment firms, advisory practices, and
            institutional teams.
          </DocsText>
          <DocsCallout type="tip">
            Security architecture documentation is shared during the onboarding process. Every client
            receives a detailed security packet on the first call.
          </DocsCallout>
        </FadeIn>
      </div>

      <TableOfContents items={tocItems} />
    </div>
  );
}
