# Architecture

## Narrative

OpenFi Lido MCP Suite is a fork-first, mainnet-ready Lido system that lets humans fund AI agents with wstETH-backed yield while structurally protecting principal, monitors Lido Earn vault positions in plain language, and exposes staking, treasury, and governance actions through a reusable MCP server.

## System Diagram

```mermaid
flowchart LR
  U["User / OpenClaw ingress"] --> CP["OpenFi Control Plane"]
  CP --> CO["Coordinator"]
  CO --> LA["lido-agent (OpenFi adapter)"]

  subgraph CORE["Shared Lido Domain Core (packages/shared/src/lido)"]
    CL["Clients + networks"]
    AD["Adapters (staking, withdrawals, rewards, earn, governance)"]
    FM["Schemas + formatters"]
  end

  LA --> CORE
  MCP["Standalone MCP server (packages/lido-mcp)"] --> CORE
  OFMCP["OpenFi MCP server"] --> CORE
  MON["Monitor (packages/monitor/src/lido)"] --> CORE

  CORE --> EX["Execution chain (mainnet fork/default or mainnet live)"]
  LA --> TR["Sepolia trust/identity (ERC-8004)"]
  EX --> RC["Receipts + verification"]
  RC --> WEB["Web dashboard"]
```

## Trust vs Execution Split

```mermaid
flowchart LR
  subgraph T["Trust Domain"]
    TS["Sepolia (11155111)"]
    ID["ERC-8004 identity + manifest/trust checks"]
  end

  subgraph E["Execution Domain"]
    FK["Mainnet fork (default)"]
    MN["Mainnet live (optional)"]
    LD["Lido protocol + YieldSafeTreasury + ComputeCreditsMerchant"]
  end

  TS --> ID
  FK --> LD
  MN --> LD
```

## Lifecycle

OpenFi run lifecycle for Lido actions:

1. discover
2. plan
3. trust check (Sepolia)
4. policy check
5. dry run
6. execute
7. verify
8. summarize
9. record

## Invariants

- Agent cannot withdraw principal from `YieldSafeTreasury`
- Principal baseline tracked in stETH-equivalent units
- Spend path rechecks principal floor post-transfer
- Whitelist/per-tx/window/sub-agent budget checks enforced onchain
- Receipts always include chain/domain labels

## Threat Model

- Compromised agent key
- Malicious merchant recipient
- Stale APR/health data
- RPC/API downtime
- Owner misconfiguration (whitelist/caps/budgets)
- Rebase/accounting misunderstandings
- Trust/execution chain confusion

## Security Assumptions

- Owner key custody is secure
- Sepolia trust metadata is correctly registered
- Execution signer has expected permissions
- Lido addresses are sourced from official docs only
