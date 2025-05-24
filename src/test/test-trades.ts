import { ethers } from 'ethers';
import { buyPT, sellPT } from '../utils/transactions';
import { PENDLE_ROUTER_ADDRESS, PENDLE_MARKET_ADDRESS, WETH_ADDRESS } from '../contracts/addresses';

export {};

const main = async () => {
    if (!process.env.PRIVATE_KEY) {
        throw new Error('PRIVATE_KEY environment variable is required');
    }

    try {
        // Connect to Base network
        const provider = new ethers.providers.JsonRpcProvider('https://mainnet.base.org');
        
        // Create a wallet with the private key
        const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        const wallet = {
            signer,
            address: await signer.getAddress(),
            provider
        };

        // Test amount (0.001 ETH)
        const testAmount = '0.001';
        
        console.log('Testing with wallet address:', wallet.address);
        console.log('Current ETH balance:', ethers.utils.formatEther(await provider.getBalance(wallet.address)));
        
        console.log('\nTesting parameters:', {
            amount: testAmount,
            router: PENDLE_ROUTER_ADDRESS,
            market: PENDLE_MARKET_ADDRESS,
            weth: WETH_ADDRESS
        });

        // Test buy
        console.log('\nTesting buyPT...');
        const buyResult = await buyPT(testAmount, wallet, 0.5);
        console.log('Buy transaction hash:', buyResult.transactionHash);
        console.log('Buy gas used:', buyResult.gasUsed.toString());

        // Wait a bit before selling
        console.log('\nWaiting 5 seconds before selling...');
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Test sell
        console.log('\nTesting sellPT...');
        const sellResult = await sellPT(testAmount, wallet, 0.5);
        console.log('Sell transaction hash:', sellResult.transactionHash);
        console.log('Sell gas used:', sellResult.gasUsed.toString());

        console.log('\nFinal ETH balance:', ethers.utils.formatEther(await provider.getBalance(wallet.address)));

    } catch (error: any) {
        console.error('Test failed:', error.message);
        if (error.data) {
            console.error('Contract error data:', error.data);
        }
        if (error.transaction) {
            console.error('Failed transaction:', error.transaction);
        }
        process.exit(1);
    }
};

main().catch(console.error);
