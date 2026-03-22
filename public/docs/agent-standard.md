# Agent Standard

This document defines the OpenFi agent interface, required manifests, run lifecycle, safety requirements, and instructions for creating a new agent package.

## OpenFiAgentModule interface

Every agent in OpenFi must implement the `OpenFiAgentModule` interface exported from `@openfi/core`:

```typescript
interface OpenFiAgentModule {
  slug: string;
  displayName: string;
  version: string;
  manifest: OpenFiAgentManifest;
  identityMode: "erc8004-required";

  canHandle(task: OpenFiTask): Promise<boolean> | boolean;

  plan(
    task: OpenFiTask,
    context: AgentContext,
  ): Promise<OpenFiPlan>;

  dryRun?(
    task: OpenFiTask,
    plan: OpenFiPlan,
    context: AgentContext,
  ): Promise<OpenFiDryRunResult>;

  execute(
    task: OpenFiTask,
    plan: OpenFiPlan,
    context: AgentContext,
  ): Promise<OpenFiExecutionResult>;

  verify(
    task: OpenFiTask,
    executionResult: OpenFiExecutionResult,
    context: AgentContext,
  ): Promise<OpenFiVerificationResult>;

  summarize(
    task: OpenFiTask,
    executionResult: OpenFiExecutionResult,
    verificationResult: OpenFiVerificationResult,
    context: AgentContext,
  ): Promise<OpenFiSummary>;
}
```

### Field descriptions

| Field | Type | Description |
|---|---|---|
| `slug` | `string` | Unique kebab-case identifier for the agent |
| `displayName` | `string` | Human-readable agent name |
| `version` | `string` | Semver version string |
| `manifest` | `OpenFiAgentManifest` | Full agent manifest (see below) |
| `identityMode` | `"erc8004-required"` | Must always be `"erc8004-required"` |

### Method descriptions

**canHandle(task)** -- Returns true if this agent is capable of handling the given task. The orchestrator calls this during the Discover phase to confirm agent capability before planning.

**plan(task, context)** -- Produces a structured plan with one or more steps. Each step has a `stepId`, `description`, `agentSlug`, and `dependsOn` array for sequencing.

**dryRun(task, plan, context)** -- Optional. Simulates execution without side effects. Returns warnings, estimated gas, simulation results per step, and any policy violations detected.

**execute(task, plan, context)** -- Runs the plan. Returns success/failure status, per-step results, receipt IDs, and timestamps.

**verify(task, executionResult, context)** -- Validates execution results. Returns named checks with pass/fail status and an overall score between 0 and 1.

**summarize(task, executionResult, verificationResult, context)** -- Produces a human-readable summary of what happened, key actions taken, receipt references, and any warnings.

## AgentContext

The context object passed to every lifecycle method:

```typescript
interface AgentContext {
  runId: string;
  taskId: string;
  parentRunId?: string;
  operatorWallet: string;
  computeBudget: ComputeBudget;
  trustThreshold?: TrustThreshold;
  logger: {
    info(message: string, ...args: unknown[]): void;
    warn(message: string, ...args: unknown[]): void;
    error(message: string, ...args: unknown[]): void;
    debug(message: string, ...args: unknown[]): void;
  };
  services: Record<string, unknown>;
}
```

The `computeBudget` enforces limits on agent execution:

```typescript
interface ComputeBudget {
  maxSteps: number;
  maxToolCalls: number;
  maxRuntimeMs: number;
  maxOnchainWrites: number;
  maxGasWei?: string;
}
```

Default budget: 10 steps, 50 tool calls, 300000ms runtime, 5 onchain writes.

## Required manifests

Each agent must provide three manifest files. These are served through the control plane's `/.well-known/` routes and stored in the data/manifests directory.

### agent-registration.json

The ERC-8004 registration document. This is the URI stored onchain when an agent registers with the Identity Registry.

```json
{
  "type": "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
  "name": "My Agent",
  "description": "What this agent does",
  "image": "https://example.com/icon.png",
  "services": [
    {
      "kind": "openfi-api",
      "url": "http://localhost:3001",
      "description": "OpenFi control plane API"
    },
    {
      "kind": "mcp",
      "url": "http://localhost:3010/mcp",
      "description": "MCP endpoint"
    }
  ],
  "registrations": [
    {
      "agentRegistry": "0x8004A818BFB912233c491871b3d84c89A494BD9e",
      "agentId": 1,
      "chainId": 11155111
    }
  ],
  "supportedTrust": [
    {
      "protocol": "erc-8004",
      "version": "1.0"
    }
  ]
}
```

Service kinds: `web`, `mcp`, `oasf`, `openfi-api`, `a2a`.

### agent.json

The detailed agent capability manifest:

```json
{
  "schema": "https://openfi.dev/schemas/agent/v1",
  "name": "My Agent",
  "slug": "my-agent",
  "version": "0.1.0",
  "description": "What this agent does",
  "ownerWallet": "0x...",
  "operatorWallet": "0x...",
  "erc8004": {
    "agentRegistry": "0x8004A818BFB912233c491871b3d84c89A494BD9e",
    "agentId": 1,
    "registrationTxHash": "0x..."
  },
  "capabilities": ["task-coordination", "data-lookup"],
  "tools": [
    {
      "name": "lookup",
      "description": "Look up data by key"
    }
  ],
  "computeConstraints": {
    "maxSteps": 10,
    "maxToolCalls": 50,
    "maxRuntimeMs": 300000,
    "maxOnchainWrites": 5
  },
  "taskCategories": ["general"],
  "safety": {
    "requiresDryRun": true,
    "requiresVerification": true,
    "maxOnchainWritesPerRun": 5
  },
  "endpoints": {
    "api": "http://localhost:3001",
    "mcp": "http://localhost:3010/mcp",
    "web": "http://localhost:3000"
  }
}
```

### agent_log.json

An append-only execution log updated after each run:

```json
{
  "schema": "https://openfi.dev/schemas/agent-log/v1",
  "agent": {
    "slug": "my-agent",
    "name": "My Agent",
    "version": "0.1.0",
    "erc8004AgentId": 1
  },
  "runs": [
    {
      "runId": "run_abc123",
      "startedAt": "2026-01-15T10:00:00.000Z",
      "endedAt": "2026-01-15T10:00:05.000Z",
      "goal": "Look up current gas prices",
      "budget": {
        "maxSteps": 10,
        "maxToolCalls": 50,
        "maxRuntimeMs": 300000,
        "maxOnchainWrites": 5
      },
      "plan": [
        {
          "stepId": "step-1",
          "description": "Query gas oracle",
          "agentSlug": "my-agent"
        }
      ],
      "steps": [
        {
          "stepId": "step-1",
          "status": "completed",
          "result": "Gas price: 15 gwei"
        }
      ],
      "retries": [],
      "failures": [],
      "receipts": [
        {
          "type": "api",
          "ref": "gas-oracle-call",
          "summary": "Queried gas oracle endpoint"
        }
      ],
      "summary": "Successfully retrieved current gas prices."
    }
  ]
}
```

## Run lifecycle

Every task follows a nine-phase lifecycle managed by the orchestrator:

### Phase 1: Discover

The orchestrator looks up the coordinator agent by slug and confirms it is installed and available.

### Phase 2: Plan

The coordinator's `plan()` method is called. It returns an `OpenFiPlan` with ordered steps. Each step declares which agent handles it and what other steps it depends on.

### Phase 3: Trust Check

The trust engine evaluates the coordinator agent's trust snapshot. If the agent's trust score falls below the configured threshold, or if required checks (identity, registration, validation) fail, the run is rejected.

### Phase 4: Policy Check

The policy engine validates that the task's compute budget does not exceed system limits. It checks step count, tool call count, runtime duration, and onchain write limits.

### Phase 5: Dry Run

If the agent implements `dryRun()`, the dry runner calls it. The result includes warnings, estimated gas costs, per-step simulation results, and any policy violations. A `dry_run` receipt is created. If dry-run reports policy violations, execution does not proceed.

### Phase 6: Execute

The executor calls the agent's `execute()` method. The agent performs its work within the compute budget. Each step produces a status and optional result or error. The run status changes from `planning` to `running`.

### Phase 7: Verify

The verifier calls the agent's `verify()` method. It returns named checks (each with pass/fail and optional details) and an overall score between 0 and 1. A `verification` receipt is created.

### Phase 8: Summarize

The summarizer calls the agent's `summarize()` method. It produces a human-readable text summary, a list of key actions, receipt references, and any warnings.

### Phase 9: Record

The recorder persists the full run data (plan, dry-run result, execution result, verification result, summary, and receipts) to storage. The agent_log.json manifest is updated.

## Run and task statuses

Run statuses: `pending`, `planning`, `running`, `completed`, `failed`, `cancelled`.

Task statuses: `pending`, `assigned`, `running`, `completed`, `failed`, `cancelled`, `rejected`.

## Safety behavior requirements

All agents must follow these safety rules:

1. **Budget enforcement** -- Never exceed the compute budget. If `maxSteps` is 10, do not execute an 11th step. If `maxOnchainWrites` is 5, do not submit a 6th transaction.

2. **Dry-run honesty** -- If `safety.requiresDryRun` is true in the manifest, the agent must implement `dryRun()`. The dry-run must accurately reflect what `execute()` would do. Do not simulate a safe path and then execute a different one.

3. **Verification honesty** -- The `verify()` method must genuinely check execution results. Do not return `passed: true` unconditionally.

4. **Receipt completeness** -- Every onchain transaction, external API call, and tool invocation should produce a receipt. Missing receipts are a trust violation.

5. **No self-modification** -- Agents must not modify their own manifest, identity registration, or trust records during execution.

6. **Treasury compliance** -- Agents must not attempt to bypass treasury policy caps. All onchain value transfers must go through the treasury contract's `executeCall` or `transferERC20` functions.

7. **Graceful failure** -- If an agent encounters an error, it must return a failed result with a clear error message rather than throwing unhandled exceptions.

8. **Idempotency awareness** -- Agents should be aware that a task may be retried. Onchain writes in particular should check for already-completed state before re-executing.

## Creating a new agent package

### Step 1: Copy the template

```bash
cp -r packages/agents/template-agent packages/agents/my-agent
```

### Step 2: Update package.json

Edit `packages/agents/my-agent/package.json`:

```json
{
  "name": "@openfi/agent-my-agent",
  "version": "0.1.0",
  "type": "module",
  "main": "dist/index.js",
  "dependencies": {
    "@openfi/core": "workspace:*",
    "@openfi/shared": "workspace:*"
  }
}
```

### Step 3: Implement the interface

Edit `packages/agents/my-agent/src/index.ts`. Replace the template stub implementations with your domain logic:

- Set `canHandle()` to return true for tasks your agent supports
- Implement `plan()` to break goals into concrete steps
- Implement `execute()` with your actual logic
- Implement `verify()` to validate results
- Implement `summarize()` to produce readable output

### Step 4: Fill out the manifest

Update the `manifest` object with your agent's actual capabilities, compute constraints, safety requirements, and ERC-8004 registration details.

### Step 5: Register with the control plane

Add your agent to the agent service's discovery mechanism so the coordinator and planner can find it. This typically means importing your agent module in the runtime's agent registry.

### Step 6: Generate manifests

Use the manifest service to generate the three required JSON files (agent-registration.json, agent.json, agent_log.json) for your agent.

### Step 7: Register identity

Register your agent's identity onchain through the ERC-8004 Identity Registry. You can do this via the `openfi_register_identity` MCP tool or through the trust package's `registerAgent` function.
