# MoonPay Payroll

## CSV Schema

Required headers:

- `name`
- `chain_address`
- `token_name`
- `chain_name`
- `account`
- `frequency`

## Validation Rules

- Header set must match required payroll schema.
- `chain_address` must be valid EVM format for current implementation.
- Unknown token/chain mapping is flagged during planning.
- Invalid rows are marked and skipped from executable routes.

## Planning Model

1. Parse CSV
2. Validate rows
3. Resolve treasury position (account/token/chain/balance)
4. Generate per-row settlement route:
- direct
- swap
- bridge
- bridge+swap

Planner is reusable and available in shared MoonPay/payroll modules.

## Execution Model

- Batch rows are persisted with row statuses:
  - `pending`, `validated`, `routed`, `executing`, `completed`, `failed`, `skipped`, `awaiting_user_action`
- Execution is idempotent per batch/row.
- Row failures do not abort unrelated rows.
- Failed rows can be retried.

## Scheduling

Scheduler state is persisted in SQLite:

- `payroll_batches`
- `payroll_batch_rows`
- `payroll_schedules`
- `payroll_run_history`
- `payroll_accounts`

Run due schedules:

```bash
pnpm payroll:run-due
```

## Notes

- Payroll is treasury-funded and must not bypass treasury controls.
- Buy-crypto flows are user-assisted and not the primary autonomous payroll path.
- Autonomous paths prefer swap/bridge/transfer routes.
