# Trust Standard

This document defines how OpenFi uses ERC-8004 for agent identity and reputation on Sepolia, the trust scoring model, and the pluggable validation adapter.

## ERC-8004 overview

ERC-8004 is an Ethereum standard for autonomous agent identity and reputation. It provides two onchain registries:

- **Identity Registry** -- Agents register with a URI pointing to their registration document. The registry assigns each agent a numeric `agentId` and tracks the owner address.
- **Reputation Registry** -- Anyone can submit structured feedback about an agent, tagged with category labels. The registry computes running averages.

ERC-8004 went live on Ethereum mainnet on January 29, 2026. OpenFi targets Sepolia for development and testing.

### Sepolia addresses

| Contract | Address |
|---|---|
| Identity Registry | `0x8004A818BFB912233c491871b3d84c89A494BD9e` |
| Reputation Registry | `0x8004B663056A597Dffe9eCcC1965A193B7388713` |

These addresses are configured via the `ERC8004_IDENTITY_REGISTRY` and `ERC8004_REPUTATION_REGISTRY` environment variables.

## Identity registration flow

Registration creates an onchain identity for an agent. The flow is:

1. **Prepare the registration document** -- Create an `agent-registration.json` file following the ERC-8004 registration schema. Host it at a stable URL.

2. **Call registerAgent** -- The agent owner calls `registerAgent(agentURI)` on the Identity Registry contract, passing the URL of the registration document.

   ```typescript
   import { createTrustClient, registerAgent } from '@openfi/trust';

   const client = createTrustClient(rpcUrl, ownerPrivateKey);
   const txHash = await registerAgent(client, 'https://example.com/.well-known/agent-registration.json');
   ```

3. **Receive agentId** -- The registry assigns a sequential `agentId` to the agent. This ID is used in all subsequent trust and reputation operations.

4. **Store the registration** -- Record the `agentId`, `agentRegistry` address, and `registrationTxHash` in the agent's manifest and local database.

You can also register via the MCP tool:

```json
{
  "tool": "openfi_register_identity",
  "arguments": {
    "slug": "my-agent",
    "ownerWallet": "0x...",
    "operatorWallet": "0x..."
  }
}
```

## agentWallet flow (EIP-712 / ERC-1271)

The `agentWallet` is an operator wallet associated with an agent identity. It allows a separate key (not the owner key) to act on behalf of the agent. This supports EIP-712 typed data signing and ERC-1271 smart-contract signature verification.

### Setting the agent wallet

The owner calls `setMetadata(agentId, "agentWallet", walletAddress)` on the Identity Registry:

```typescript
import { createTrustClient, setAgentWallet } from '@openfi/trust';

const client = createTrustClient(rpcUrl, ownerPrivateKey);
const txHash = await setAgentWallet(client, agentId, operatorWalletAddress);
```

### Reading the agent wallet

Anyone can read the operator wallet for a given agent:

```typescript
import { createTrustClient, getAgentWallet } from '@openfi/trust';

const client = createTrustClient(rpcUrl);
const wallet = await getAgentWallet(client, agentId);
```

### Verification

When OpenFi verifies an agent's identity, it checks that the `operatorWallet` in the agent's manifest matches the `agentWallet` stored onchain. This confirms that the agent's claimed operator key is authorized by the identity owner.

The operator wallet can sign EIP-712 typed data for offchain attestations. Smart-contract wallets can use ERC-1271 for onchain signature verification.

## Reputation flow

The reputation system uses the ERC-8004 Reputation Registry to collect structured feedback about agents.

### Submitting feedback

Any address can submit feedback about a registered agent:

```typescript
import { createTrustClient } from '@openfi/trust';
import { postFeedback } from '@openfi/trust';

const client = createTrustClient(rpcUrl, signerPrivateKey);
const txHash = await postFeedback(
  client,
  agentId,          // bigint: target agent's ID
  850n,             // bigint: value (e.g., 850 = 8.50 with 2 decimals)
  2,                // number: valueDecimals
  'successRate',    // string: tag1 (category)
  'executionSafety' // string: tag2 (subcategory)
);
```

### Reading reputation

```typescript
import { createTrustClient, getFeedbackCount, getAverageRating } from '@openfi/trust';

const client = createTrustClient(rpcUrl);
const count = await getFeedbackCount(client, agentId);
const average = await getAverageRating(client, agentId);
```

### tag1/tag2 mapping

Feedback uses a two-level tag system. `tag1` is the primary category and `tag2` is a subcategory or qualifier. The standard tags are:

| tag1 | Meaning |
|---|---|
| `successRate` | Percentage of tasks completed successfully |
| `responseTime` | How quickly the agent responds to task assignments |
| `policyCompliance` | Whether the agent stays within its declared policy limits |
| `verificationPassed` | Whether the agent's outputs pass verification |
| `handoffQuality` | Quality of handoffs to other agents |
| `uptime` | Agent availability over time |
| `reliability` | Consistency of behavior across runs |
| `executionSafety` | Whether the agent operates safely (no budget overruns, no policy violations) |

`tag2` provides additional context. For example, `tag1: "successRate"` and `tag2: "treasury-ops"` indicates the success rate specifically for treasury operations.

Via MCP:

```json
{
  "tool": "openfi_post_feedback",
  "arguments": {
    "agentId": 1,
    "fromAddress": "0x...",
    "value": 850,
    "valueDecimals": 2,
    "tag1": "successRate",
    "tag2": "general"
  }
}
```

## Trust scoring

The trust engine computes a composite score from five dimensions, each with a fixed weight:

| Dimension | Weight | Check |
|---|---|---|
| Identity exists | 0.25 | Agent has a registered identity in the ERC-8004 Identity Registry |
| Registration resolves | 0.20 | The agent-registration.json URL returns a valid document |
| Agent JSON resolves | 0.20 | The agent.json manifest is accessible and valid |
| Operator matches | 0.20 | The manifest's operatorWallet matches the onchain agentWallet |
| Validation status | 0.15 | The pluggable validation adapter returns a passing result |

The overall score is the sum of weights for passing dimensions, yielding a value between 0.0 and 1.0.

### Trust snapshot

A trust snapshot captures the state of all five dimensions at a point in time:

```typescript
interface TrustSnapshot {
  slug: string;
  agentId?: number;
  identityExists: boolean;
  registrationResolves: boolean;
  agentJsonResolves: boolean;
  operatorMatches: boolean;
  reputationSummary?: {
    feedbackCount: number;
    averageRating: number;
    tags: Record<string, number>;
  };
  validationStatus: 'disabled' | 'passed' | 'failed';
  overallTrustScore: number;
  snapshotAt: string;
}
```

### Trust thresholds

The orchestrator checks the trust snapshot against a configurable threshold before allowing execution:

```typescript
interface TrustThreshold {
  minTrustScore?: number;
  requireIdentity: boolean;
  requireRegistration: boolean;
  requireValidation: boolean;
  minReputation?: number;
}
```

If any required check fails or the score falls below `minTrustScore`, the run is rejected with a clear list of reasons.

### Recomputing trust

Trust snapshots can be recomputed on demand via the `openfi_recompute_trust_summary` MCP tool or through the trust service API. The recomputation fetches current onchain state, checks manifest availability, and updates the stored snapshot.

## Validation adapter

The validation adapter is a pluggable interface for external trust verification:

```typescript
interface ValidationAdapter {
  name: string;
  validate(agentId: number, proofData?: unknown): Promise<ValidationResult>;
}

interface ValidationResult {
  valid: boolean;
  provider: string;
  timestamp: string;
  details?: unknown;
}
```

By default, OpenFi ships with a `DisabledValidationAdapter` that always returns `valid: true`. This means the validation dimension contributes its full 0.15 weight to the trust score without performing any external check.

To enable real validation, implement the `ValidationAdapter` interface and register it with the trust service. Example use cases:

- KYC/KYB verification for agent operators
- Code audit attestations
- Third-party security scanning results
- Social proof or reputation imports from external systems

The adapter is called during trust snapshot recomputation. Its result is cached in the snapshot and does not require a live call on every trust check.
