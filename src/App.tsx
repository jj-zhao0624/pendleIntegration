import { usePrivy } from '@privy-io/react-auth';
import Layout from './components/Layout';
import TradeForm from './components/TradeForm';
import './components/styles.css';

function App() {
  const { authenticated } = usePrivy();

  return (
    <Layout>
      {!authenticated ? (
        <div className="welcome-message">
          <h2>Welcome to Pendle Integration</h2>
          <p>Please login to start trading PT/YT positions</p>
        </div>
      ) : (
        <div className="trading-section">
          <div className="buy-section">
            <h3>Buy PT/YT Position</h3>
            <TradeForm isBuying={true} />
          </div>
          <div className="sell-section">
            <h3>Sell PT/YT Position</h3>
            <TradeForm isBuying={false} />
          </div>
        </div>
      )}
    </Layout>
  );
}

export default App;