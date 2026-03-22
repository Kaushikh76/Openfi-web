# Operations

## Monitor Runtime

Run monitor:

```bash
pnpm dev:monitor
```

Required:

- `NEXT_PUBLIC_DEMO_WALLET`
- optional `NEXT_PUBLIC_DEMO_TREASURY`
- `SQLITE_PATH`
- `MONITOR_POLL_INTERVAL_SECONDS` (default `600`)

## Telegram Alerts

Set:

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

## Email Alerts

Set:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `ALERT_EMAIL_TO`
- optional `ALERT_EMAIL_FROM`

## Alert Cooldown

- `MONITOR_ALERT_COOLDOWN_SECONDS` controls dedupe window per alert key and channel.

## Key Rotation

1. Rotate `OPENFI_OWNER_PRIVATE_KEY` / `PRIVATE_KEY`.
2. Verify signer address with dry-run tool calls.
3. Confirm trust metadata still matches expected operator wallet.

## Updating Lido Addresses

Only update from official docs:

- https://docs.lido.fi/deployed-contracts/

Update in:

- `packages/shared/src/lido/constants.ts`

## Trust Registration (Sepolia)

1. Ensure Sepolia RPC and gas are funded.
2. Register/verify ERC-8004 metadata for `lido-agent`.
3. Confirm manifest operator wallet equals onchain `agentWallet`.

Useful endpoint:

- `GET /v1/agents/lido-agent/trust`

## Execution Funding

- Fork mode: prefund local anvil account
- Mainnet live: fund execution signer with ETH and required assets

## Treasury Invariant Verification

After spend flows, verify:

- `principalBaselineStEth` unchanged for yield-only spend
- recipient transfer succeeded
- `availableYieldStEth` decreased as expected

Use:

- `get_treasury_status`
- `preview_treasury_spend`
- OpenFi verification receipts
