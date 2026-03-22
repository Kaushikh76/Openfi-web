# MoonPay Architecture in OpenFi

## Goal

OpenFi integrates MoonPay as a first-class capability layer and adds payroll orchestration on top of it without replacing OpenFi runtime, trust, manifests, or receipt flows.

## Layered Design

1. Upstream capability layer
- MoonPay CLI (`mp`) and MoonPay MCP (`mp mcp`) remain source-of-truth execution surfaces.

2. Shared integration layer
- `packages/shared/src/moonpay/*`
- Typed interfaces, provider contracts, chain/token normalization, payroll routing helpers, schemas.

3. Provider layer
- `packages/moonpay-provider/*`
- `ManagedMoonPayMcpProvider` (launch local `mp mcp`)
- `ExternalMoonPayMcpProvider` (attach to existing MCP endpoint)
- `DirectMoonPayCliProvider` (fallback for essential commands)

4. Skill catalog layer
- `packages/moonpay-skill-sync/*`
- Syncs and parses `moonpay/skills` into local OpenFi catalog JSON.

5. Agent layer
- `packages/agents/moonpay-agent/*`
- `packages/agents/payroll-agent/*`
- MoonPay handles swap/bridge/transfer settlement work; payroll plans and executes CSV batches and delegates settlement steps to MoonPay pathways.

6. MCP exposure layer
- `packages/mcp-server/src/tools/moonpay/*`
- OpenFi MCP exposes MoonPay tools directly for Claude Code/Cursor/Codex usage.

7. Web layer
- `apps/web/src/app/moonpay/*`
- Skills catalog, provider health, payroll dry-run/execution views, demo path.

## OpenFi Runtime Integration

- Agents are discoverable and registered by the control plane.
- Runs keep standard lifecycle:
  - discover -> plan -> trust check -> policy check -> dry run -> execute -> verify -> summarize -> record
- Receipts emitted for `dry_run`, `tool`, `api`, `tx`, `verification`, `trust`.

## Trust + Execution Domains

- Trust/identity: Sepolia (ERC-8004)
- MoonPay/Lido execution: execution chain (fork/live mode depending on feature)
- Receipts include chain/domain labels so trust and execution are never conflated.

## Settlement Routing Logic

Route priority for treasury-funded payouts:

1. direct transfer (asset+chain already match)
2. same-chain swap + transfer
3. cross-chain bridge + transfer
4. bridge + swap + transfer

This planner is implemented in shared payroll/moonpay logic and reused by payroll and moonpay specialist paths.
