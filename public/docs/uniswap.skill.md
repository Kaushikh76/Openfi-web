# Uniswap Skill

Use this operational model:

- Trading API for route quotes/swaps on supported testnets.
- UniswapX is feature-flagged off on testnet.
- v4 hooks are template-first and constrained; do not generate unconstrained arbitrary hook logic by default.
- v4 LP writes use PositionManager onchain calls.
- Permit2 witness payload must bind chain, token scope, max input, recipient, deadline, and plan hash.
- Compact-style budget checks must enforce deterministic constraints before claims.
- Offchain quotes are advisory; signed witness/onchain checks are authoritative.

Dry-run before write actions when:
- route execution
- hook deploy/init
- LP write
- conditional claim execution
