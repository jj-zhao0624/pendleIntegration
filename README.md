# Pendle Integration DApp

This is a decentralized application (DApp) for interacting with Pendle Protocol on the Base network. This application allows users to trade Principal Tokens (PT) and Yield Tokens (YT) through a simple and intuitive interface.

**Demo (Vercel Deployment)**: [pendle-integration.vercel.app](https://pendle-integration.vercel.app)

## Features

- Authentication with Privy (Email and Wallet login)
- Buy and Sell PT/YT positions
- Real-time market data and price impact calculations
- Wallet integration and balance tracking
- Support for Base network
- Responsive design for mobile and desktop

## Technical Stack

- **Frontend**: React.js with TypeScript
- **Authentication**: Privy SDK
- **Blockchain Interaction**: ethers.js v5
- **Styling**: Custom CSS with responsive design
- **Smart Contract Integration**: Pendle Protocol contracts

## Prerequisites

- Node.js v14 or higher
- npm or yarn
- A modern web browser
- A wallet compatible with Base network (e.g., MetaMask)

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd pendleIntegration
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Fill in the required environment variables:
```
REACT_APP_PRIVY_APP_ID=your_privy_app_id
REACT_APP_BASE_RPC_URL=your_base_rpc_url
REACT_APP_PENDLE_ROUTER=your_pendle_router_address
REACT_APP_PENDLE_MARKET=your_pendle_market_address
```

## Running the Application

1. Start the development server:
```bash
npm start
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Smart Contract Integration

The application interacts with the following Pendle contracts on Base:

- Router: `0x00000000005BBB0EF59571E58418F9a4357b68A0`
- Market: `0x06B8976C97D2d2c1b36e527F795c7E91F2Ec1d94`
- WETH: `0x4200000000000000000000000000000000000006`

## Features Breakdown

### Authentication
- Email-based login with verification code
- Wallet connection support
- Automatic wallet creation for users without existing wallets

### Trading
- Real-time market data display
- Price impact calculation
- Slippage protection
- Gas estimation
- Transaction status tracking

### Market Information
- Time to maturity display
- PT/YT price information
- Total Value Locked (TVL) tracking
- Market maturity status

## Project Structure

```
src/
├── components/        # React components
├── contracts/        # Contract ABIs and addresses
├── hooks/           # Custom React hooks
├── utils/           # Utility functions
├── types/           # TypeScript type definitions
└── App.tsx          # Main application component
```

## Error Handling

The application includes comprehensive error handling for:
- Transaction failures
- Network connectivity issues
- Invalid input validation
- Wallet connection errors
- Market maturity checks

## Security Considerations

- All contract interactions include slippage protection
- User input validation and sanitization
- Secure authentication flow with Privy
- Protection against high price impact trades

