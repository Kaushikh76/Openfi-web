# MoonPay Security Model

## Core Rules

- Do not expose wallet private keys or secret exports in OpenFi flows.
- Do not bypass treasury controls for payroll or settlement.
- Every upstream CLI/MCP invocation must emit OpenFi receipts.
- Mark user-assisted actions explicitly (for example buy checkout links).

## Threats and Mitigations

1. Missing/expired MoonPay auth
- Detect via provider `getAuthStatus`
- Return explicit setup instructions instead of silent failure

2. Provider binary missing (`mp` not installed)
- Managed provider returns health failure, does not crash
- Fallback mode available for allowed direct CLI paths

3. Unsupported token/chain requests
- Validate early in payroll planner and dry-run
- Return row-level actionable errors

4. Partial payroll failures
- Row-level status persistence and retry
- No silent batch corruption

5. Cross-agent context loss
- Handoff receipts capture source agent, target agent, and reason

## User-Assisted Flow Policy

- Buy-crypto and browser checkout are explicitly user-assisted.
- Payroll automation should use swap/bridge/transfer routes by default.
