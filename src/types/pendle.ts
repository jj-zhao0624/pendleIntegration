export interface TokenType {
  symbol: string;
  address: string;
  decimals: number;
}

export interface TokenPair {
  pt: TokenType;
  yt: TokenType;
  sy: TokenType;
  underlying: TokenType;
}

export interface TradeType {
  type: 'PT' | 'YT';
  action: 'BUY' | 'SELL';
}

export interface TokenWithYield {
  interest?: string;  // compounding yield token
  rewards?: string[]; // non-compounding yield tokens
}

// Map of YT tokens to their yield types
export const YT_YIELD_MAP: Record<string, TokenWithYield> = {
  'YT-GLP': {
    rewards: ['ETH']
  },
  'YT-wstETH': {
    interest: 'stETH'
  },
  'YT-ETHx': {
    interest: 'ETH'
  },
  'YT-aUSDC': {
    interest: 'aUSDC'
  },
  'YT-rETH-WETH_BalancerLP': {
    interest: 'liquidity of rETH-WETH pool',
    rewards: ['AURA', 'BAL']
  }
};

// PT redemption ratios (1 PT = 1 Asset)
export const PT_ASSET_MAP: Record<string, string> = {
  'PT-GLP': 'GLP',
  'PT-wstETH': 'stETH',
  'PT-ETHx': 'ETH',
  'PT-aUSDC': 'aUSDC'
};

export interface PendleToken {
    address: string;
    symbol: string;
    decimals: number;
}

export interface PendleMarket {
    address: string;
    pt: PendleToken;
    yt: PendleToken;
    sy: PendleToken;
    underlyingAsset: PendleToken;
    maturity: number;
}

export interface PendleTokenPair {
    ptAddress: string;  // PT token address
    ytAddress: string;  // YT token address
    syAddress: string;  // SY token address
    marketAddress: string;  // Market address
}

export interface YieldInfo {
    interest: string;    // Compounding yield token (if any)
    rewards: string[];   // Additional reward tokens (if any)
}

// Token redemption ratios
export interface RedemptionRatio {
    syToAsset: number;  // How much underlying asset 1 SY represents
    ptToSy: number;     // How much SY 1 PT represents at maturity
    ytToSy: number;     // Current yield accrual ratio
}
