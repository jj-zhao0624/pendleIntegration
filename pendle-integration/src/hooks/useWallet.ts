import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { PENDLE_MARKET_ADDRESS, PENDLE_ROUTER_ADDRESS } from '../contracts/addresses';
import PendleMarketABI from '../contracts/abis/PendleMarket.json';
import PendleRouterABI from '../contracts/abis/PendleRouter.json';

interface WalletState {
    address: string | null;
    balance: string | null;
    provider: ethers.providers.Web3Provider | null;
    signer: ethers.Signer | null;
}

const useWallet = () => {
    const [wallet, setWallet] = useState<WalletState>({
        address: null,
        balance: null,
        provider: null,
        signer: null
    });

    const initializeWallet = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const address = await signer.getAddress();
                const balance = await provider.getBalance(address);

                setWallet({
                    address,
                    balance: ethers.utils.formatEther(balance),
                    provider,
                    signer
                });
            } catch (error) {
                console.error('Error initializing wallet:', error);
            }
        }
    };

    useEffect(() => {
        initializeWallet();
    }, []);

    return wallet;
};

export default useWallet;