import React, { useEffect, useState } from 'react';
import { useWallets, usePrivy } from '@privy-io/react-auth';
import { ethers } from 'ethers';

const Sidebar: React.FC = () => {
    const { wallets } = useWallets();
    const { authenticated } = usePrivy();
    const [balance, setBalance] = useState<string | null>(null);
    const activeWallet = wallets[0];

    useEffect(() => {
        const fetchBalance = async () => {
            if (activeWallet?.address) {
                try {
                    const provider = new ethers.providers.JsonRpcProvider(
                        process.env.REACT_APP_BASE_RPC_URL
                    );
                    const balanceWei = await provider.getBalance(activeWallet.address);
                    setBalance(ethers.utils.formatEther(balanceWei));
                } catch (error) {
                    console.error('Error fetching balance:', error);
                }
            }
        };

        fetchBalance();
    }, [activeWallet?.address]);

    if (!authenticated || !activeWallet) {
        return null;
    }

    return (
        <div className="sidebar">
            <div className="sidebar-section">
                <h3>Wallet Details</h3>
                <div className="wallet-detail">
                    <span>Address:</span>
                    <span className="monospace">
                        {activeWallet.address.slice(0, 6)}...{activeWallet.address.slice(-4)}
                    </span>
                </div>
                <div className="wallet-detail">
                    <span>Balance:</span>
                    <span>{balance ? `${Number(balance).toFixed(4)} ETH` : 'Loading...'}</span>
                </div>
                <div className="wallet-detail">
                    <span>Wallet Type:</span>
                    <span>{activeWallet.walletClientType}</span>
                </div>
                <div className="wallet-detail">
                    <span>Chain:</span>
                    <span>Base</span>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
