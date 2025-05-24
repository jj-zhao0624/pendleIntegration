import { ethers } from 'ethers';
import { PendleMarket, RedemptionRatio } from '../types/pendle';
import PendleMarketABI from '../contracts/abis/PendleMarket.json';

export const calculatePtValue = async (
    market: PendleMarket,
    provider: ethers.providers.Provider
): Promise<RedemptionRatio> => {
    // This is a placeholder. In a real implementation, you would:
    // 1. Query the SY contract for current exchange rate to underlying asset
    // 2. Calculate PT redemption value based on time to maturity
    // 3. Calculate YT value based on current yield
    return {
        syToAsset: 1.0,  // 1 SY = 1 underlying asset
        ptToSy: 1.0,     // 1 PT = 1 SY at maturity
        ytToSy: 0.0      // Current yield accrual
    };
};

export const isMarketMatured = (market: PendleMarket): boolean => {
    const now = Math.floor(Date.now() / 1000);
    return now >= market.maturity;
};

export const getTimeToMaturity = (market: PendleMarket): number => {
    const now = Math.floor(Date.now() / 1000);
    return Math.max(0, market.maturity - now);
};

export const formatDuration = (seconds: number): string => {
    if (seconds <= 0) return 'Matured';
    
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    return `${days}d ${hours}h ${minutes}m`;
};

export const fetchMarketData = async (
    market: PendleMarket,
    provider: ethers.providers.Provider
): Promise<{ ptPrice: number; ytPrice: number; tvl: number }> => {
    const marketContract = new ethers.Contract(
        market.address,
        PendleMarketABI.abi,
        provider
    );

    try {
        // Fetch current market rates and liquidity
        const [totalSupply, reserves] = await Promise.all([
            marketContract.totalSupply(),
            marketContract.getReserves()
        ]);

        // Calculate prices based on reserves
        const ptPrice = reserves[0].mul(ethers.constants.WeiPerEther).div(reserves[1]);
        const ytPrice = reserves[1].mul(ethers.constants.WeiPerEther).div(reserves[0]);
        
        // Calculate TVL
        const tvl = reserves[0].add(reserves[1]).mul(ptPrice).div(ethers.constants.WeiPerEther);

        return {
            ptPrice: Number(ethers.utils.formatEther(ptPrice)),
            ytPrice: Number(ethers.utils.formatEther(ytPrice)),
            tvl: Number(ethers.utils.formatEther(tvl))
        };
    } catch (error) {
        console.error('Error fetching market data:', error);
        return {
            ptPrice: 0,
            ytPrice: 0,
            tvl: 0
        };
    }
};

export const calculatePriceImpact = async (
    market: PendleMarket,
    amount: ethers.BigNumber,
    isBuying: boolean,
    provider: ethers.providers.Provider
): Promise<number> => {
    const marketContract = new ethers.Contract(
        market.address,
        PendleMarketABI.abi,
        provider
    );

    try {
        const reserves = await marketContract.getReserves();
        const [baseReserve, quoteReserve] = reserves;
        
        // Calculate price impact using constant product formula (x * y = k)
        const k = baseReserve.mul(quoteReserve);
        let newBaseReserve: ethers.BigNumber;
        let newQuoteReserve: ethers.BigNumber;

        if (isBuying) {
            newBaseReserve = baseReserve.add(amount);
            newQuoteReserve = k.div(newBaseReserve);
        } else {
            newBaseReserve = baseReserve.sub(amount);
            newQuoteReserve = k.div(newBaseReserve);
        }

        const oldPrice = baseReserve.mul(ethers.constants.WeiPerEther).div(quoteReserve);
        const newPrice = newBaseReserve.mul(ethers.constants.WeiPerEther).div(newQuoteReserve);
        
        // Calculate price impact as percentage
        const priceImpact = newPrice.sub(oldPrice).mul(100).div(oldPrice);
        
        return Number(ethers.utils.formatUnits(priceImpact.abs(), 2));
    } catch (error) {
        console.error('Error calculating price impact:', error);
        return 0;
    }
};
