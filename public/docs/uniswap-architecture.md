# Uniswap Architecture

OpenFi Uniswap suite has three specialist agents inside the existing runtime:

- `hooksmith-agent`
- `route-agent`
- `compact-permit-agent`

Shared core:

- `packages/shared/src/uniswap/*`
- `packages/uniswap-gateway/*`
- `packages/routing/*`
- `packages/liquidity/*`
- `packages/hooksmith/*`
- `packages/compact-permit/*`

Trust/execution split:

- Trust: Sepolia ERC-8004
- Execution: Unichain Sepolia (1301), Base Sepolia (84532), Sepolia (11155111)

```mermaid
flowchart LR
  U[User or MCP Client] --> CP[OpenFi Control Plane]
  CP --> CO[Coordinator]
  CO --> RA[Route Agent]
  CO --> HA[Hooksmith Agent]
  CO --> CA[Compact Permit Agent]
  RA --> GW[Uniswap Gateway]
  GW --> API[Trading API]
  RA --> V4[V4 Contracts]
  HA --> V4
  CA --> V4
  RA --> R[Receipts]
  HA --> R
  CA --> R
```

Notes:
- UniswapX adapter is scaffolded as feature-flagged off (`UNISWAPX_ENABLED=false`) for testnet.
- LP writes run through direct PositionManager calls.
