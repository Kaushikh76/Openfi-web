# Uniswap MCP API

Read tools:
- `uniswap_get_supported_testnets`
- `uniswap_get_api_status`
- `uniswap_get_v4_deployments`
- `uniswap_get_hook_templates`
- `uniswap_quote_route`
- `uniswap_preview_route`
- `uniswap_get_hook_risk_summary`
- `uniswap_get_compact_budget`
- `uniswap_get_claim_status`
- `uniswap_get_permit2_allowance`
- `uniswap_get_pool_state`
- `uniswap_get_position`
- `uniswap_list_positions`
- `uniswap_preview_create_position`
- `uniswap_preview_rebalance`
- `uniswap_preview_collect_fees`
- `uniswap_get_fee_summary`

Write tools (all support `dry_run`):
- `uniswap_generate_hook_spec`
- `uniswap_test_hook`
- `uniswap_mine_hook_address`
- `uniswap_deploy_hook`
- `uniswap_init_hook_pool`
- `uniswap_route_execute`
- `uniswap_wrap_execute`
- `uniswap_unwrap_execute`
- `uniswap_bridge_execute`
- `uniswap_create_position`
- `uniswap_increase_liquidity`
- `uniswap_decrease_liquidity`
- `uniswap_close_position`
- `uniswap_collect_fees`
- `uniswap_rebalance_position`
- `uniswap_create_compact_budget`
- `uniswap_prepare_permit_witness`
- `uniswap_execute_conditional_claim`

Dry run semantics:
- no broadcast
- returns expected calls, warnings, and expected state changes

Live semantics:
- broadcasts on configured testnet signer
- returns tx hash
- verification can be fetched from run receipts
