# API and MCP Tools

## Chain Labels

- Trust: `sepolia` / `11155111`
- Execution: `mainnet-fork` / `31337` (default) or `mainnet` / `1`

## Dry Run Semantics

Every write tool supports:

```json
{ "dry_run": true | false }
```

When `dry_run=true`:

- no broadcast
- expected calls
- expected state changes
- warnings
- gas estimate (best-effort)
- chain labels

When `dry_run=false`:

- transaction broadcast
- tx hash + post-state summary
- OpenFi receipts emitted in OpenFi-native mode

## Standalone MCP Tools (`packages/lido-mcp`)

### Read

- `get_lido_balances`
- `get_staking_quote`
- `get_rewards_summary`
- `get_earn_vault_health`
- `get_earn_position`
- `list_recent_alerts`
- `get_treasury_status`
- `preview_treasury_spend`
- `list_lido_votes`
- `get_lido_vote`
- `get_lido_monitor_status`

### Write

- `stake_eth`
- `request_unstake`
- `claim_unstaked`
- `wrap_steth`
- `unwrap_wsteth`
- `deploy_yield_treasury`
- `fund_yield_treasury`
- `configure_treasury_recipient`
- `configure_authorized_agent`
- `configure_subagent_budget`
- `spend_treasury_yield`
- `buy_compute_credits_from_yield`
- `delegate_lido_governance`
- `cast_lido_vote` (optional path)

## OpenFi Control-Plane Chat API

Endpoint:

- `POST /v1/chat`

Example:

```bash
curl -X POST http://127.0.0.1:3001/v1/chat \
  -H 'content-type: application/json' \
  -d '{
    "message": "Dry run request unstake 0.1 stETH",
    "submitTask": true,
    "dry_run": true
  }'
```

## Example Prompts

- “Show my EarnETH spread versus raw stETH APR.”
- “Dry run delegation to 0x...”
- “Request unstake of 0.25 stETH and show expected calls.”
- “Spend treasury yield to buy compute credits and verify principal floor.”
- “List recent Lido monitor alerts.”
