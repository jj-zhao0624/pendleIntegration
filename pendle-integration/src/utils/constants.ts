export const PENDLE_MARKET_ADDRESS = "0xYourPendleMarketAddressHere";
export const PENDLE_ROUTER_ADDRESS = "0xYourPendleRouterAddressHere";

export const NETWORK = {
    NAME: "Base Network",
    CHAIN_ID: 1234, // Replace with actual chain ID
    RPC_URL: "https://rpc.base.network", // Replace with actual RPC URL
};

export const TRANSACTION_CONFIRMATIONS = 1; // Number of confirmations to wait for transactions

export const DEFAULT_SLIPPAGE = 0.5; // 0.5%
export const GAS_LIMIT = 500000;
export const BASE_NETWORK_ID = 8453;
export const BASE_TOKEN_ADDRESS = '0x4200000000000000000000000000000000000006'; // WETH on Base

export const TRANSACTION_TYPES = {
    BUY: 'BUY',
    SELL: 'SELL'
} as const;