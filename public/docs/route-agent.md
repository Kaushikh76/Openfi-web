# Route Agent

Responsibilities:
- Trading API route quote/build/execute
- Permit2 + Universal Router execution path
- Wrap/unwrap/bridge routing in same API-driven flow
- LP lifecycle writes through PositionManager `modifyLiquidities`

Policy controls include:
- chain allowlist
- slippage cap
- recipient constraints
- route dry-run before writes
