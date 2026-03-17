"use client";

import { FadeIn } from "@/components/animated";
import { Accordion, DocsHeading, DocsText } from "@/components/docs";
import { Button } from "@/components/ui";

const faqItems = [
  {
    question: "What is Klade vs. Clay?",
    answer: "Klade is the company. Clay is the AI analyst product that Klade builds and deploys. Think of Klade as the team behind the product, and Clay as the AI teammate your team works with directly. When you interact with Clay, you're using Klade's technology — but the experience is through Clay's interface.",
  },
  {
    question: "Is Clay just a chatbot?",
    answer: "No. Clay is a structured analytical engine, not a conversational AI. When you ask Clay a question, it doesn't generate a chat-style response. It routes your request to specialized analytical desks, executes structured analysis, and returns a professional deliverable — with sources, assumptions, and formatting ready for use. The difference is the output: chatbots give you text, Clay gives you work product.",
  },
  {
    question: "What kinds of businesses use Clay?",
    answer: "Clay is built for teams that produce analytical deliverables under time pressure: private equity firms running due diligence, hedge funds needing daily intelligence, family offices managing portfolio risk, investment banks preparing pitch materials, and startups preparing board materials. Any team that spends significant time on financial research, modeling, and reporting can benefit from Clay.",
  },
  {
    question: "How customizable is Clay?",
    answer: "Each Clay deployment is configured specifically for your team's workflows. During onboarding, we map your analytical processes, deliverable formats, and data needs. Clay is then configured with the right specialist desks, output templates, and integrations. This isn't one-size-fits-all — it's a moldable system shaped to how your team actually works.",
  },
  {
    question: "How does onboarding work?",
    answer: "Onboarding is founder-led and takes days, not months. It starts with a discovery session where we map your workflows and pain points. Then we configure Clay for your team — activating the right desks, calibrating output formats, and connecting your communication platform. Most teams are live within a week of first contact.",
  },
  {
    question: "How does security work?",
    answer: "Every client gets a dedicated, isolated Clay instance. Your data never touches another client's workspace, is never used for model training, and is never shared. Clay operates on a least-privilege model with workflow-scoped access controls and complete audit logging. Built on NVIDIA NemoClaw-compatible architecture for enterprise sandbox deployment.",
  },
  {
    question: "What can Clay handle?",
    answer: "Clay's 14 specialist desks cover: valuation modeling (DCFs, LBOs, comps), research and analysis (company deep-dives, sector screening, competitive intel), financial analysis (statement analysis, KPIs, budgeting), risk management (portfolio analytics, risk assessment), deal execution (screening, IC memos, pitch support), and market intelligence (morning briefs, earnings analysis, macro tracking). If it's structured financial work, Clay can likely handle it.",
  },
  {
    question: "What platforms does Clay work on?",
    answer: "Clay connects to Slack, Discord, and Telegram. Your team submits requests and receives deliverables through whichever platform you already use — no new tools to learn, no separate login, no portal to check. Choose one or connect multiple.",
  },
  {
    question: "How is Clay different from ChatGPT or Copilot?",
    answer: "General-purpose AI tools generate text responses to prompts. Clay executes structured analytical workflows through specialized desks. The difference shows in the output: where ChatGPT might give you a paragraph about DCF methodology, Clay gives you an actual DCF model with sourced assumptions, sensitivity tables, and scenario analysis. Clay is a work execution engine, not a conversation partner.",
  },
  {
    question: "What does Clay cost?",
    answer: "Pricing is usage-based and depends on your team's volume and the specialist desks activated. We discuss pricing during the onboarding process after understanding your specific needs. Visit our pricing page for tier details, or reach out directly to discuss your use case.",
  },
];

export default function FAQPage() {
  return (
    <div className="max-w-3xl">
      <FadeIn>
        <p className="text-[11px] uppercase tracking-[0.16em] text-[#4fd1ff]">Common Questions</p>
        <DocsHeading className="mt-4">Frequently Asked Questions</DocsHeading>
        <DocsText className="mt-4 text-lg mb-8">
          Everything you need to know about Klade and Clay. Can&apos;t find what you&apos;re looking for?
          Reach out to a founder directly.
        </DocsText>
      </FadeIn>

      <FadeIn delay={0.05}>
        <Accordion items={faqItems} />
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="mt-10 rounded-2xl border border-[#4fd1ff]/15 bg-[#4fd1ff]/5 p-6 text-center">
          <p className="text-lg font-semibold text-white">Still have questions?</p>
          <p className="mt-2 text-sm text-[#9aa4cb]">Talk directly to the founders who built Clay.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Button href="/#lead-form">Get in Touch</Button>
            <Button href="mailto:arjun@kladeai.com" variant="secondary">Email a Founder</Button>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
