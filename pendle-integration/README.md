# Pendle Integration Project

This project is a simple integration of Pendle using direct smart contract calls. It allows users to buy or sell PT/YT positions on the Pendle platform while providing a basic frontend interface with user authentication through Privy.

## Project Structure

```
pendle-integration
├── src
│   ├── components
│   │   ├── Layout.tsx
│   │   ├── LoginButton.tsx
│   │   ├── TradeForm.tsx
│   │   └── WalletInfo.tsx
│   ├── contracts
│   │   ├── abis
│   │   │   ├── PendleMarket.json
│   │   │   └── PendleRouter.json
│   │   └── addresses.ts
│   ├── hooks
│   │   ├── usePrivy.ts
│   │   └── useWallet.ts
│   ├── utils
│   │   ├── constants.ts
│   │   └── transactions.ts
│   ├── App.tsx
│   ├── index.tsx
│   └── types.ts
├── .env
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

## Features

- **User Authentication**: Users can sign in using Privy.
- **Wallet Management**: Users can fund a new wallet and view their wallet information.
- **Trading Functionality**: Users can buy or sell PT/YT positions directly through smart contract calls.

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   cd pendle-integration
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on the `.env.example` file and add your environment variables.

4. Start the application:
   ```
   npm start
   ```

## Usage

- Navigate to the application in your browser.
- Use the login button to authenticate with Privy.
- Access the trading form to buy or sell PT/YT positions.

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.