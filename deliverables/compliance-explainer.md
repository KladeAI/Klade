# Clay by Klade AI — Compliance & Security Overview

**AI-powered financial analysis built for regulated firms.**

---

## Data Sources: Public & Government Only

Clay's intelligence is built exclusively on publicly available, government-published data:

- **SEC EDGAR** — Corporate filings (10-K, 10-Q, 8-K, proxy statements)
- **FRED** — Federal Reserve economic indicators
- **FDIC** — Bank financial and regulatory data
- **U.S. Treasury** — Rates, auction data, fiscal reports

No proprietary client data is ingested, processed, or stored on Klade servers in our standard deployment. Client proprietary data is only handled in on-premise configurations where it never leaves the client's network.

## Infrastructure & Compliance

- **SOC 2 Type II compliant infrastructure** — hosted on Supabase Pro with enterprise-grade encryption at rest and in transit
- **No client PII or proprietary data on our servers** — standard deployment uses only public data sources
- **Role-based access controls** and audit logging across all platform operations

## On-Premise Deployment Option

For security-conscious firms requiring full data sovereignty:

- Clay deploys entirely within the client's infrastructure
- Client proprietary data **never leaves their network**
- Same analytical capabilities, zero external data exposure
- Ideal for firms with strict compliance mandates or internal data governance policies

## Architecture: Separation by Design

| Layer | Data Type | Location |
|-------|-----------|----------|
| **Layer 0** | Raw government/public APIs | Klade Cloud |
| **Layer 1** | Structured & indexed data | Klade Cloud |
| **Layer 2** | Enriched & vectorized analysis | Klade Cloud |
| **Layer 3** | Client proprietary data | **On-prem only** |

Layers 0–2 contain exclusively public data. Layer 3 exists only in on-premise deployments and is fully isolated from Klade's cloud infrastructure.

## Not Investment Advice

Clay is a **research and analysis tool** — not a financial advisor. Clay does not:

- Make trading recommendations or buy/sell signals
- Provide personalized investment advice
- Execute or suggest transactions

All output is analytical research intended to support — not replace — professional judgment.

## Citation-First Approach

Every data point, statistic, and factual claim in Clay's output includes a **traceable citation** to its source — filing name, date, section, or data series. If data is unavailable or stale, Clay discloses that explicitly. No hallucinated numbers, no uncited claims.

---

**Built for:** Boutique investment banks · Private equity firms · Family offices · Wealth managers

---

<p align="center"><strong>Questions?</strong> Contact Arjun Rath — <a href="mailto:arjun@kladeai.com">arjun@kladeai.com</a><br>© 2026 Klade AI · kladeai.com</p>
