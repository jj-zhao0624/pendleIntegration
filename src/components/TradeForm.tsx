import React, { useState, useEffect } from 'react';
import { useWallets } from '@privy-io/react-auth';
import { ethers } from 'ethers';
import { buyPT, sellPT } from '../utils/transactions';
import { BASE_NETWORK_ID } from '../utils/constants';
import { PENDLE_MARKETS } from '../utils/constants';
import { formatDuration, getTimeToMaturity, fetchMarketData, calculatePriceImpact } from '../utils/pendleUtils';

interface TradeFormProps {
  isBuying: boolean;
}

interface MarketData {
  ptPrice: number;
  ytPrice: number;
  tvl: number;
  priceImpact: number;
}

const TradeForm: React.FC<TradeFormProps> = ({ isBuying }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [marketData, setMarketData] = useState<MarketData>({
    ptPrice: 0,
    ytPrice: 0,
    tvl: 0,
    priceImpact: 0
  });
  
  const { wallets } = useWallets();
  const activeWallet = wallets[0];
  
  const market = PENDLE_MARKETS['ETH-JUN2024'];
  const timeToMaturity = getTimeToMaturity(market);

  useEffect(() => {
    const fetchData = async () => {
      if (!activeWallet) return;

      try {
        const ethereumProvider = await activeWallet.getEthereumProvider();
        const provider = new ethers.providers.Web3Provider(ethereumProvider);
        
        const data = await fetchMarketData(market, provider);
        
        if (amount) {
          const amountBN = ethers.utils.parseEther(amount);
          const impact = await calculatePriceImpact(market, amountBN, isBuying, provider);
          setMarketData({ ...data, priceImpact: impact });
        } else {
          setMarketData({ ...data, priceImpact: 0 });
        }
      } catch (error) {
        console.error('Error fetching market data:', error);
      }
    };

    fetchData();
  }, [activeWallet, amount, isBuying]);

  const handleTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !activeWallet) return;

    setLoading(true);
    setError(null);

    try {
      // Get the Ethereum provider from the wallet
      const ethereumProvider = await activeWallet.getEthereumProvider();
      const provider = new ethers.providers.Web3Provider(ethereumProvider);
      const signer = provider.getSigner();

      const wallet = {
        signer,
        address: activeWallet.address,
        provider
      };

      if (isBuying) {
        await buyPT(amount, wallet, 0.5);
      } else {
        await sellPT(amount, wallet, 0.5);
      }
      
      alert(`Successfully ${isBuying ? 'bought' : 'sold'} PT/YT positions.`);
      setAmount('');
    } catch (error: any) {
      console.error('Transaction failed:', error);
      setError(error.message || 'Transaction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleTrade} className="trade-form">
      <div className="trade-info">
        <p>Market: {market.pt.symbol}</p>
        <p>Time to Maturity: {formatDuration(timeToMaturity)}</p>
        <p>PT Price: {marketData.ptPrice.toFixed(6)} ETH</p>
        <p>YT Price: {marketData.ytPrice.toFixed(6)} ETH</p>
        <p>TVL: {marketData.tvl.toFixed(2)} ETH</p>
        {amount && (
          <p className={marketData.priceImpact > 5 ? 'warning' : ''}>
            Price Impact: {marketData.priceImpact.toFixed(2)}%
          </p>
        )}
      </div>
      <div className="input-group">
        <input
          type="number"
          step="0.000001"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          disabled={loading}
        />
      </div>
      {error && <div className="error-message">{error}</div>}
      {marketData.priceImpact > 5 && (
        <div className="warning-message">
          High price impact! Your trade will move the market price significantly.
        </div>
      )}
      <button 
        type="submit" 
        disabled={loading || !activeWallet || timeToMaturity <= 0 || marketData.priceImpact > 10}
      >
        {loading ? 'Processing...' : `${isBuying ? 'Buy' : 'Sell'} PT`}
      </button>
      {timeToMaturity <= 0 && (
        <div className="warning-message">
          This market has matured. Trading is no longer available.
        </div>
      )}
    </form>
  );
};

export default TradeForm;