import React from 'react';
import { useWallets } from '@privy-io/react-auth';

const WalletInfo: React.FC = () => {
    const { wallets } = useWallets();
    const activeWallet = wallets[0]; // Get the first connected wallet

    if (!activeWallet) {
        return null;
    }

    return (
        <div className="wallet-info">
            <p>Address: {activeWallet.address.slice(0, 6)}...{activeWallet.address.slice(-4)}</p>
        </div>
    );
};

export default WalletInfo;