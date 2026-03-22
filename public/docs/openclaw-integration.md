# OpenFi OpenClaw Integration

## Architecture

OpenClaw serves as an optional chat ingress layer for OpenFi. It does NOT own orchestration, trust, treasury, or the agent execution engine. OpenClaw's role is strictly:

- Accept user messages via chat channels (Telegram, Discord, Control UI)
- Forward execution requests to OpenFi via the plugin
- Present results back to the user

## Plugin Pattern

The OpenFi OpenClaw plugin follows the standard plugin contract:

### Entry Point

```typescript
// packages/openclaw-plugin-openfi/src/index.ts
export function register(api) {
  const client = createApiClient(api.config);
  registerTools(api, client, api.config);
}
```

The `register(api)` function receives the plugin API object with:
- `api.config` - Plugin configuration from openclaw.plugin.json
- `api.registerTool(tool)` - Register a tool for the frontdesk agent

### Plugin Manifest

```json
{
  "id": "openfi-ingress",
  "name": "OpenFi Ingress",
  "description": "Routes tasks from OpenClaw to the OpenFi execution framework",
  "skills": ["skills/openfi-ingress"],
  "configSchema": {
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "apiBaseUrl": { "type": "string", "default": "http://127.0.0.1:3001" },
      "apiKey": { "type": "string" },
      "defaultCoordinatorSlug": { "type": "string", "default": "coordinator" },
      "timeoutMs": { "type": "number", "default": 30000 },
      "pollIntervalMs": { "type": "number", "default": 2000 },
      "exposeStatusTools": { "type": "boolean", "default": true }
    }
  }
}
```

### Plugin Tools

| Tool | Description |
|------|-------------|
| `openfi_submit_task` | Submit a task for execution |
| `openfi_get_run_status` | Check run status by runId |
| `openfi_list_agents` | List available agents |
| `openfi_get_agent_manifest` | Get agent manifest |
| `openfi_get_receipt` | Get execution receipts |
| `openfi_get_trust_summary` | Get trust summary |

### Skill

The plugin ships a skill at `skills/openfi-ingress/SKILL.md` that teaches the OpenClaw frontdesk agent to:
- Delegate execution tasks to OpenFi
- Report run IDs to users
- Present receipts and summaries
- Keep conversational chatter minimal during execution

## OpenClaw Modes

### disabled (default)

OpenFi runs standalone without OpenClaw. No chat ingress is available.

```bash
OPENCLAW_MODE=disabled
```

### external

Connect to an already-running OpenClaw gateway. You must configure the external URL and ensure the plugin is installed there.

```bash
OPENCLAW_MODE=external
OPENCLAW_URL=http://127.0.0.1:18789
```

### managed-local

OpenFi automatically starts a local OpenClaw gateway as a child process. This mode:

1. Verifies `openclaw` binary exists in PATH
2. Creates state directory at `./.local/openclaw/`
3. Writes OpenClaw config with the plugin pre-configured
4. Installs and enables the local plugin
5. Starts the gateway process
6. Waits for health check on port 18789

```bash
OPENCLAW_MODE=managed-local
```

## Dev Flow

### Same-Command Boot

```bash
# Start everything including managed-local OpenClaw
OPENCLAW_MODE=managed-local pnpm dev:all
```

This starts:
1. Anvil (if chain mode is anvil)
2. Treasury contract deployment
3. OpenFi Control Plane (port 3001)
4. OpenFi MCP Server (port 3010)
5. OpenFi Web Dashboard (port 3000)
6. OpenClaw Gateway (port 18789)

### Testing from Control UI

1. Open the OpenClaw Control UI (if configured) or use the API directly
2. Send a message like "Check the available agents"
3. The frontdesk agent uses `openfi_submit_task` to delegate to OpenFi
4. OpenFi coordinator plans and executes the task
5. Results are returned through the plugin and presented to the user

### Task Flow

```
User Message → OpenClaw Frontdesk → openfi_submit_task →
  OpenFi API (POST /v1/ingress/openclaw/task) →
  Run Created → Coordinator Plans → Agents Execute →
  Results → Plugin Polls Status → OpenClaw Responds
```

## Configuration

### OpenClaw Config (auto-generated in managed-local mode)

```json
{
  "gateway": { "host": "127.0.0.1", "port": 18789 },
  "plugins": {
    "openfi-ingress": {
      "enabled": true,
      "path": "./packages/openclaw-plugin-openfi",
      "config": {
        "apiBaseUrl": "http://127.0.0.1:3001",
        "apiKey": "",
        "defaultCoordinatorSlug": "coordinator"
      }
    }
  },
  "model": { "provider": "anthropic", "model": "claude-sonnet-4-20250514" }
}
```

Do not attempt to automate Telegram bot creation. External channels must be configured manually after the gateway is running.
