# OpenFi Lido Agent Package

Path: `packages/agents/lido-agent`

## Identity

- `slug`: `lido-agent`
- `displayName`: `OpenFi Lido Agent`
- `identityMode`: `erc8004-required`

## Interface Implementation

The package implements:

- `canHandle()`
- `plan()`
- `dryRun()`
- `execute()`
- `verify()`
- `summarize()`

## Task Domains

- staking
- treasury
- monitoring
- governance

Structured task handling supports:

- `task.input.domain = "lido"`
- `task.input.action`
- `task.input.kind in {"stake","wrap","unwrap","treasury","monitor","governance"}`

## Safety Configuration

- `requiresDryRun = true`
- `requiresVerification = true`
- conservative onchain write limits per run

## Runtime Notes

- Sepolia trust checks use ERC-8004 metadata (when agent id is configured)
- Mainnet-fork (default) or mainnet clients execute Lido operations and treasury flows
- Receipts include explicit chain/domain labels in encoded payloads

## Files

- `src/canHandle.ts`
- `src/plan.ts`
- `src/dryRun.ts`
- `src/execute.ts`
- `src/verify.ts`
- `src/summarize.ts`
- `src/tasks.ts`
- `src/runtime.ts`
- `src/receipts.ts`
- `src/types.ts`
- `src/index.ts`
