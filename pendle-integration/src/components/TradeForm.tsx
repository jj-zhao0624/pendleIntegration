import React, { useState } from 'react';
import useWallet from '../hooks/useWallet';
import { buyPT, sellPT } from '../utils/transactions';

interface TradeFormProps {
  isBuying: boolean;
}

const TradeForm: React.FC<TradeFormProps> = ({ isBuying }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const wallet = useWallet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !wallet.signer) return;

    setLoading(true);
    try {
      const parsedAmount = amount;
      if (isBuying) {
        await buyPT(parsedAmount, wallet, 0.5);
      } else {
        await sellPT(parsedAmount, wallet, 0.5);
      }
      alert(`Successfully ${isBuying ? 'bought' : 'sold'} PT/YT positions.`);
      setAmount('');
    } catch (error) {
      console.error('Transaction failed:', error);
      alert(`Failed to ${isBuying ? 'buy' : 'sell'} PT/YT positions.`);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="trade-form">
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
      <button type="submit" disabled={loading || !wallet.signer}>
        {loading ? 'Processing...' : isBuying ? 'Buy PT/YT' : 'Sell PT/YT'}
      </button>
    </form>
  );
};

export default TradeForm;