import { PendleMarket } from '../types/pendle';
import { PENDLE_MARKET_ADDRESS, PENDLE_ROUTER_ADDRESS, WETH_ADDRESS } from '../contracts/addresses';

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

// Pendle Token Types
export enum PendleTokenType {
    PT = 'PT',
    YT = 'YT',
    SY = 'SY'
}

// Pendle Market Info
export const PENDLE_MARKET_INFO = {
    'PT-WETH': {
        type: PendleTokenType.PT,
        underlyingAsset: 'ETH',
        maturityDate: '2025-12-31', // Updated maturity date
        ratio: 1, // 1 PT = 1 ETH at maturity
    },
    'YT-WETH': {
        type: PendleTokenType.YT,
        underlyingAsset: 'ETH',
        yieldType: 'Interest',
        maturityDate: '2025-12-31',
    }
};

// Example market data (replace with actual market data from Base)
export const PENDLE_MARKETS: { [key: string]: PendleMarket } = {
    'ETH-JUN2024': {
        address: '0x24e4Df37ea00C4954d668e3ce19fFe25A3d36F9A',
        pt: {
            address: '0x1234...', // Replace with actual PT address
            symbol: 'PT-ETH-DEC2025',  // Updated symbol
            decimals: 18
        },
        yt: {
            address: '0x5678...', // Replace with actual YT address
            symbol: 'YT-ETH-DEC2025',  // Updated symbol
            decimals: 18
        },
        sy: {
            address: '0x9abc...', // Replace with actual SY address
            symbol: 'SY-ETH',
            decimals: 18
        },
        underlyingAsset: {
            address: WETH_ADDRESS,
            symbol: 'WETH',
            decimals: 18
        },
        maturity: 1798761600 // December 31, 2025 UTC
    }
};