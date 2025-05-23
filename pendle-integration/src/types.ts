export interface WalletInfo {
    address: string;
    balance: number;
    transactionHistory: Transaction[];
}

export interface Transaction {
    id: string;
    amount: number;
    timestamp: Date;
    type: 'buy' | 'sell';
}

export interface TradeFormValues {
    positionType: 'PT' | 'YT';
    amount: number;
}

export interface AuthUser {
    id: string;
    email: string;
    walletAddress: string;
}