# Lido Security Notes

## Principal Protection

- `YieldSafeTreasury` enforces principal floor in stETH-equivalent units.
- Agent spend path is yield-only.
- Principal withdrawal is owner-only.

## Onchain Controls

- Recipient whitelist
- Per-transaction cap
- Rolling window cap
- Sub-agent budget cap
- Post-spend principal invariant check

## Dry-Run and Verification

- Every write tool supports dry-run.
- OpenFi verification confirms postconditions and emits receipts.
- Receipts include chain/domain labels for auditability.

## Key Risks

- Compromised agent signer
- Malicious recipient/merchant
- Misconfigured whitelist/caps
- RPC or API downtime
- Stale benchmark or allocation feed
- Sepolia trust vs execution chain confusion

## Mitigations

- Keep whitelist enabled in production.
- Use conservative caps and sub-agent budgets.
- Monitor alerts for spread/allocation changes.
- Require dry-run before writes in user-facing flows.
- Regularly verify ERC-8004 trust metadata and operator wallet wiring.
