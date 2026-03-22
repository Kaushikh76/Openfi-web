# Liquidity

LP flow in this build:
- Read pool state from StateView
- Preview range around current tick
- Submit explicit PositionManager calldata for modify operations
- Verify tx receipt after writes

Actions:
- create
- increase
- decrease
- close
- collect fees
- rebalance
