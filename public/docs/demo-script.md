# Demo Script (3-5 Minutes)

## Setup

```bash
pnpm install
cp .env.example .env
pnpm dev:all
```

Optional deployments:

```bash
pnpm deploy:treasury:fork
pnpm deploy:merchant:fork
```

## Narrated Flow

1. Open `/lido` and state the narrative.
2. Show Sepolia trust vs mainnet-fork execution split.
3. Open `/lido/demo`.
4. Show trust snapshot from `/v1/agents/lido-agent/trust`.
5. Show execution chain label (`mainnet-fork` by default).
6. Deploy treasury (or show existing deployment).
7. Fund treasury with wstETH principal.
8. Show available yield > 0.
9. Whitelist merchant and authorize agent.
10. Spend yield to buy compute credits.
11. Show principal baseline unchanged.
12. Open `/lido/monitor` and show EarnETH/EarnUSD health + recent alerts.
13. Show governance delegation dry-run.
14. Open `/lido/mcp` and explain same tools in standalone MCP mode.

## Judge Talking Points

- One shared Lido core powers OpenFi mode and standalone MCP mode.
- Principal protection is enforced onchain.
- Monitor alerts are plain-language and actionable.
- Chain labels remove trust/execution ambiguity.
