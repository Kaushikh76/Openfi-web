# Uniswap Security

Guardrails:
- No free-form AI authorization for budget release.
- Permit2 witness payload includes chain and recipient constraints.
- Arbiter checks verify plan hash and recipient.
- Hook deploy paths include static validation and post-deploy verification.
- Route policy enforces slippage and chain allowlists.
- API gateway rate-limits to conservative default 2 req/s and short quote cache.

Known limitations:
- LP list indexing is not integrated; direct tokenId lookup is supported.
- Hook tests are generated scaffold-level in this iteration; extend with Foundry suites for production submissions.
