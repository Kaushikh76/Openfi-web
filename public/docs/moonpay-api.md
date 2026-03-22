# MoonPay MCP API (OpenFi MCP)

MoonPay tools are exposed via the existing OpenFi MCP server under `moonpay_*` tool names.

## Read / Catalog Tools

- `moonpay_list_skills`
- `moonpay_get_skill`
- `moonpay_get_skill_markdown`
- `moonpay_get_auth_status`
- `moonpay_list_wallets`
- `moonpay_get_wallet`
- `moonpay_check_wallet`
- `moonpay_token_search`
- `moonpay_list_upstream_tools`

## Write / Settlement Tools

- `moonpay_swap`
- `moonpay_bridge`
- `moonpay_transfer`
- `moonpay_buy_crypto`
- `moonpay_create_deposit`
- `moonpay_export_transactions`
- `moonpay_invoke_upstream_tool`

## Payroll Tools

- `moonpay_payroll_validate_csv`
- `moonpay_payroll_plan`
- `moonpay_payroll_execute`
- `moonpay_payroll_list_batches`
- `moonpay_payroll_get_batch`
- `moonpay_payroll_pause_schedule`
- `moonpay_payroll_resume_schedule`

## Dry Run Semantics

All write tools accept `dry_run` where technically possible.

When `dry_run=true`:
- no broadcast/execution side effects
- route plan + expected calls + warnings returned
- policy and input validation results returned

When `dry_run=false`:
- provider invokes upstream MCP/CLI action
- tx/status refs returned where available
- OpenFi receipts are written for tool/api/tx/verification events

## Example MCP Prompts

- "List MoonPay skills and show only Tier 1 executable skills."
- "Dry-run a USDC transfer to 0x... on Base from treasury account main."
- "Dry-run payroll for this CSV and show which rows require bridge+swap."
- "Execute payroll batch <id> and show row-level failures only."
