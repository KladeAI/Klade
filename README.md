# Cadre

AI Employees for modern businesses.

Cadre is building a new category: **AI staffing**. Companies can deploy role-specific AI employees that plug into existing tools (Slack, Google Workspace, CRM, PM suites) and operate with approval-aware autonomy.

## Mission

Give every business access to high-performance digital talent that was previously unaffordable.

> "We don't eliminate jobs. We let small firms access talent they could never afford."

## Product Direction

Cadre follows a **base + role-layer architecture**:

- **Base employee runtime** (shared skills, memory, integrations, approvals)
- **Role-specific layers** (Executive Assistant, Analyst, Researcher, etc.)

The first baseline employee is **Jarvis** (Executive Assistant).

## Core Principles

1. **Plug-and-play integrations**
   - Connect common business tools quickly
   - Standardized connector framework

2. **Human-in-the-loop trust**
   - Sensitive actions require approval
   - Transparent activity logs

3. **Model-agnostic architecture**
   - Use the best model per task
   - Keep backend swappable as models improve

4. **Operator-grade execution**
   - Built for real workflows, not demo chat
   - Reliability and clear auditability first

## Repositories

- `cadre` (this repo): product application and AI employee runtime
- `founder-os`: internal execution and operating system for company buildout

## Current Status

- MVP in active development
- Live UI prototype deployed
- Integration framework and employee-runtime architecture in progress

## Security & Access

- Private repositories by default
- Least-privilege access and staged hardening
- Dedicated bot/machine-user migration planned for production operations

## Build Focus (Current)

1. Complete Jarvis baseline runtime
2. Expand integration surface area
3. Harden onboarding, approvals, and observability
4. Prepare first implementation-ready customer flow

---

**Founder note:** This is a serious startup build. Ship fast, but keep the system clean, auditable, and scalable from day one.
