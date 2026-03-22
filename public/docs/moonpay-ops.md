# MoonPay Operations

## Environment Setup

Required minimum:

- `MOONPAY_MODE`
- `MOONPAY_MCP_COMMAND`
- `MOONPAY_MCP_ARGS`
- `MOONPAY_MCP_URL` (for external mode)
- `MOONPAY_BIN`
- `MOONPAY_SKILLS_REPO`
- `MOONPAY_SKILLS_REF`
- `MOONPAY_SKILLS_CACHE_DIR`
- `MOONPAY_ALLOW_DIRECT_CLI_FALLBACK`

Payroll:

- `PAYROLL_DEFAULT_TREASURY_ACCOUNT`
- `PAYROLL_SCHEDULER_ENABLED`
- `PAYROLL_SCHEDULER_POLL_SECONDS`

## Day-1 Commands

```bash
pnpm moonpay:provider:health
pnpm moonpay:sync-skills
pnpm moonpay:catalog
pnpm payroll:run-due
```

## Provider Modes

1. `external-mcp`
- Attach to existing MoonPay MCP endpoint (`MOONPAY_MCP_URL`).

2. `managed-mcp`
- OpenFi launches `mp mcp` subprocess and checks health.

3. `direct-cli`
- Essential fallback path when MCP transport is unavailable.

Selection preference:
- external MCP if configured
- managed local MCP
- direct CLI fallback for essential commands

## Auth Runbook

If unauthenticated:

1. Install MoonPay CLI
2. Run MoonPay login/auth command in terminal
3. Re-run `pnpm moonpay:provider:health`

## Payroll Runbook

1. Upload or provide CSV with required schema
2. Run `moonpay_payroll_validate_csv`
3. Run `moonpay_payroll_plan` (`dry_run=true`)
4. Review row routes and warnings
5. Execute with `moonpay_payroll_execute` when approved
6. Retry failed rows by batch/row state
