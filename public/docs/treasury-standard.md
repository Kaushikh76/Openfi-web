# OpenFi Treasury Standard

## Shared Treasury Philosophy

OpenFi uses a single shared treasury contract instead of one wallet per agent. This design provides:

- **Centralized policy enforcement**: All spending caps, target allowlists, and selector restrictions are enforced at the contract level
- **Unified audit trail**: Every execution emits events with `runId`, `taskId`, and `purpose` attribution
- **Operator-based access control**: Each agent has one designated operator wallet that can execute on its behalf
- **Window-based spending limits**: Time-based spending caps prevent runaway execution
- **Owner-controlled configuration**: Only the treasury owner can modify policies, add targets, or enable agents

## Contract Architecture

### OpenFiTreasury.sol

The main treasury contract holds ETH and ERC20 tokens. Key features:

- **AgentPolicy struct**: Per-agent configuration including operator address, caps, and allowlists
- **Agent identification**: `bytes32 agentKey = keccak256(slug)` maps agent slugs to onchain policy
- **Dual authorization**: Either the agent's operator or an approved relayer can execute
- **Pause mechanism**: Owner can pause all execution in emergencies

### OpenFiTreasuryFactory.sol

Deploys new treasury instances. Used for testing and future multi-tenant support.

## Contract Invariants

1. Only the agent's operator or an approved relayer can execute calls
2. The contract never uses `delegatecall` - only `call`
3. The contract blocks `target == address(this)` to prevent self-calls
4. A paused contract blocks all execution
5. Inactive agents cannot execute
6. Window resets only occur when the window duration has expired

## Policy Model

Each agent has a policy with:

| Field | Description |
|-------|-------------|
| `active` | Whether the agent can execute |
| `operator` | Wallet address authorized to execute |
| `nativePerTxCapWei` | Maximum ETH per single transaction |
| `nativeWindowCapWei` | Maximum ETH in the current time window |
| `windowDurationSeconds` | Length of the spending window (default: 86400 = 24h) |
| `requireTargetAllowlist` | If true, target address must be pre-approved |
| `requireSelectorAllowlist` | If true, function selector must be pre-approved |

### Target and Selector Allowlists

```solidity
mapping(bytes32 => mapping(address => bool)) public allowedTargets;
mapping(bytes32 => mapping(bytes4 => bool)) public allowedSelectors;
```

### ERC20 Controls

```solidity
mapping(bytes32 => mapping(address => bool)) public allowedTokens;
mapping(bytes32 => mapping(address => uint256)) public erc20PerTxCaps;
mapping(bytes32 => mapping(address => uint256)) public erc20WindowCaps;
```

## Dry-Run Rules

Dry-run is **offchain only**. There is no onchain dry-run mechanism.

Dry-runs use viem's `simulateContract` to:
1. Verify the call would succeed with current policy settings
2. Estimate gas costs
3. Check that caps would not be exceeded
4. Validate target and selector allowlists

```typescript
const result = await treasuryClient.simulateExecuteCall({
  agentSlug: 'my-agent',
  target: '0x...',
  value: BigInt(0),
  data: '0x...',
  runId: 'run_abc123',
  taskId: 'task_xyz',
  purpose: 'Deposit collateral',
});
```

Every onchain write must be preceded by a dry-run simulation in the runtime.

## Receipt Events

All execution events include attribution metadata:

```solidity
event NativeExecuted(
    bytes32 indexed agentKey,
    address indexed operator,
    address indexed target,
    uint256 value,
    bytes4 selector,
    bytes32 runId,
    bytes32 taskId,
    string purpose
);

event ERC20Transferred(
    bytes32 indexed agentKey,
    address indexed operator,
    address indexed token,
    address to,
    uint256 amount,
    bytes32 runId,
    bytes32 taskId,
    string purpose
);
```

These events create an immutable onchain audit trail linking every treasury operation to a specific agent, run, and task.

## Window Reset Timing Rules

Window resets follow strict timing rules to prevent early reset exploits:

```solidity
function resetNativeWindowIfNeeded(bytes32 agentKey) public {
    AgentPolicy storage p = agentPolicies[agentKey];
    if (block.timestamp >= p.nativeWindowStart + p.windowDurationSeconds) {
        p.nativeWindowStart = block.timestamp;
        p.nativeWindowSpentWei = 0;
    }
    // If window has NOT expired, this is a no-op
}
```

The same rule applies to ERC20 windows. No one can call reset to grant a fresh spending window before the current window expires.

## Deployment

### Local (Anvil)

Automatic with `pnpm dev:all`:

1. Anvil starts with deterministic mnemonic
2. `SetupDev.s.sol` deploys factory and treasury
3. Sets noop-agent policy with second Anvil account as operator
4. Funds treasury with 10 ETH
5. Injects address into runtime config

### Sepolia

Manual deployment:

```bash
# Set environment variables
export SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
export OPENFI_OWNER_PRIVATE_KEY=0x...

# Deploy
pnpm deploy:contracts:sepolia

# Note the printed treasury address and set it:
export OPENFI_TREASURY_ADDRESS=0x...
```

Then start OpenFi with `OPENFI_CHAIN_MODE=sepolia`.
