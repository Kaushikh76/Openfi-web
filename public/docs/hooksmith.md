# Hooksmith Agent

Template-first flow:
1. Parse constrained hook spec
2. Select archetype template
3. Generate source and test scaffold
4. Run static validation and risk summary
5. Mine deployment salt (optional)
6. Deploy hook
7. Initialize pool
8. Verify deployment receipt and bytecode hash

Supported archetypes:
- dynamic-fee
- oracle-twap-guard
- range-protection
- rebate-rewards
- treasury-skim
- inventory-skew
- lp-auto-rebalance-helper
- fee-routing-auto-compound
