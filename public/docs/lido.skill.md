# Lido Skill (Operational)

## Core Assets

- `stETH`: rebasing token representing staked ETH.
- `wstETH`: non-rebasing wrapper around stETH.

## Rebase Model

- `stETH` balance rebases over time.
- `wstETH` balance stays fixed; value vs stETH changes via conversion rate.

## Treasury Accounting Rule

- Hold treasury in `wstETH`.
- Track principal in stETH-equivalent units with `getStETHByWstETH`.
- Available yield = current stETH-equivalent value - principal baseline - reserved.
- Agents spend only yield, never principal.

## Safe Staking Patterns

1. Stake ETH -> stETH.
2. Wrap stETH -> wstETH for deterministic treasury accounting.
3. Use dry-run before all writes.

## Withdrawal Pattern

1. `request_unstake` (creates withdrawal request/NFT state).
2. Wait for finalization.
3. `claim_unstaked`.

## Earn Basics

- Monitor supports EarnETH and EarnUSD (and EarnUSDc helper path).
- Compare vault APR against raw stETH APR benchmark.
- Watch allocation shifts across Aave/Morpho/Pendle/Gearbox/Maple when present.

## Governance Basics

- List votes/proposals.
- Read vote details.
- Delegate voting power.
- Vote casting is optional and permission-dependent.

## Chain Policy

- Trust domain: Sepolia only.
- Execution domain: mainnet fork by default, optional mainnet live.
- Never conflate trust-chain verification with execution-chain tx confirmation.

## Pre-Write Checklist

1. Is this action a write?
2. Has dry-run passed?
3. Is recipient trusted/whitelisted?
4. Will principal floor remain intact?
5. Are per-tx/window/sub-agent limits satisfied?
6. Are chain labels correct in output?

## Decision Heuristics

- If intent is uncertain, choose read-only path first.
- For governance actions, default to delegation dry-run.
- For treasury spends, always preview before execute.
- If monitor data feed is stale/unavailable, communicate uncertainty and avoid risky writes.
