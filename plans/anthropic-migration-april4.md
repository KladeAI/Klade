# Anthropic Migration Plan — April 4, 2026
**Deadline: 3 PM ET (7 PM UTC)**

## What's Happening
Anthropic is blocking third-party tools (OpenClaw) from using Claude Max subscription tokens after 3 PM ET on April 4.

## Plan A: Refresh Setup Token (try first, 2 min)

SSH into VPS and run:
```bash
claude setup-token
```
Copy the token it outputs, then run:
```bash
openclaw models auth paste-token --provider anthropic
```

Test it:
```bash
openclaw models status
```

If it works → done. Everything stays the same.

## Plan B: Swap Default to GPT-5.4 (if Plan A fails, 1 min)

Run this on VPS:
```bash
# Change default model to GPT-5.4 (covered by OpenAI Max $200/mo)
openclaw config set agents.defaults.model.primary "openai/gpt-5.4" --global

# Keep Claude as fallback for heavy work via Claude Code ACP
openclaw config set agents.defaults.model.fallbacks '["anthropic/claude-opus-4-6","openai/gpt-5","openai-codex/gpt-5.3-codex"]' --global
```

Then restart gateway:
```
openclaw gateway restart
```
⚠️ WARNING: gateway restart kills all sessions. Do this when no subagents are running.

## Plan C: Enable Extra Usage (if we want to keep Claude primary, costs money)

1. Go to claude.ai → Settings → Usage
2. Enable "Extra Usage" 
3. Claim the one-time $200 credit (expires April 17)
4. This bills per-token beyond the credit — monitor costs

## Recommendation
Try Plan A first. If blocked, go Plan B (GPT-5.4 for conversation, Claude Code for heavy work). Plan C only if we really need Claude as primary and are willing to pay extra.

## Cost Impact
- Plan A: $0 (same $200/mo Max)
- Plan B: $0 (same $200/mo OpenAI Max)
- Plan C: $200 credit first, then pay-per-token (~$0.10-2.00/task)
