# OpenFi MCP Server

## Overview

The OpenFi MCP server exposes framework-level tools via the Model Context Protocol. It supports both Streamable HTTP and stdio transports.

## Transport Modes

### Streamable HTTP

```
URL: http://127.0.0.1:3010/mcp
Health: http://127.0.0.1:3010/healthz
```

Uses `StreamableHTTPServerTransport` from `@modelcontextprotocol/sdk`. Supports POST, GET, and DELETE on the `/mcp` endpoint.

### stdio

```bash
# Run via npx
npx openfi-mcp

# Or directly
node packages/mcp-server/dist/stdio.js
```

Uses `StdioServerTransport`. Suitable for MCP clients that manage the server process directly (e.g., Claude Code, Cursor).

## Tools

### Read Tools

| # | Tool | Description |
|---|------|-------------|
| 1 | `openfi_list_agents` | List all installed OpenFi agents |
| 2 | `openfi_get_agent` | Get agent details by slug |
| 3 | `openfi_get_agent_manifest` | Get agent.json manifest |
| 4 | `openfi_get_agent_log` | Get agent execution log (agent_log.json) |
| 5 | `openfi_get_run` | Get run details by runId |
| 6 | `openfi_get_run_receipts` | Get all receipts for a run |
| 7 | `openfi_get_trust_summary` | Get trust snapshot and summary for an agent |
| 8 | `openfi_get_treasury_status` | Get treasury contract status (balance, owner, paused) |
| 9 | `openfi_get_treasury_policy` | Get treasury policy for an agent |

### Write Tools

All write tools support `dry_run: true` to preview actions without executing them.

| # | Tool | Description |
|---|------|-------------|
| 10 | `openfi_register_identity` | Register/update agent identity |
| 11 | `openfi_set_agent_wallet` | Set agent operator wallet |
| 12 | `openfi_submit_task` | Submit a task for execution |
| 13 | `openfi_configure_treasury_policy` | Configure treasury policy for an agent |
| 14 | `openfi_dry_run_call` | Simulate a treasury call |
| 15 | `openfi_execute_call` | Execute a treasury call |
| 16 | `openfi_dry_run_transfer_erc20` | Simulate an ERC20 transfer |
| 17 | `openfi_transfer_erc20` | Execute an ERC20 transfer |
| 18 | `openfi_post_feedback` | Post reputation feedback to cache |
| 19 | `openfi_recompute_trust_summary` | Recompute trust snapshot for an agent |

## Dry-Run Semantics

When `dry_run: true` is passed to a write tool:
- No state changes are made
- The tool returns what would happen, including simulation results, estimated gas, and policy check outcomes
- For treasury operations, `simulateContract` is used via viem

When `dry_run: false` (default):
- The operation executes normally
- Returns transaction hashes, run IDs, and receipt summaries

## Input Schemas

All input schemas are defined using `import * as z from 'zod/v4'` and are shared between the MCP server and control-plane API via `packages/core`.

### Example: openfi_submit_task

```json
{
  "goal": "Check treasury balance",
  "coordinatorSlug": "coordinator",
  "dry_run": false
}
```

### Example: openfi_execute_call

```json
{
  "agentSlug": "my-agent",
  "target": "0x1234...",
  "value": "0",
  "data": "0xabcdef...",
  "runId": "run_abc123",
  "taskId": "task_xyz",
  "purpose": "Deposit collateral",
  "dry_run": true
}
```

## Service Layer Reuse

The MCP server uses the same service layer (`packages/services`) as the control-plane API. Both are thin transport adapters over:

- `AgentService` - agent CRUD and identity management
- `RunService` - run lifecycle and task management
- `TrustService` - trust snapshots and reputation
- `TreasuryService` - policy management and execution
- `ManifestService` - manifest generation and serving

This ensures consistent behavior regardless of whether tools are invoked via MCP or HTTP API.
