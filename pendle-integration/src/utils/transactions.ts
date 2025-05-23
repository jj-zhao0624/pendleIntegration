import { ethers } from 'ethers';
import { PENDLE_MARKET_ADDRESS, PENDLE_ROUTER_ADDRESS } from '../contracts/addresses';
import PendleRouterABI from '../contracts/abis/PendleRouter.json';

// Constants for the Base network
const BASE_TOKEN_ADDRESS = '0x4200000000000000000000000000000000000006'; // WETH on Base

export const getContract = (
    address: string,
    abi: any,
    signerOrProvider: ethers.Signer | ethers.providers.Provider
) => {
    return new ethers.Contract(address, abi, signerOrProvider);
};

export const calculateMinOutput = (amount: string, slippage: number) => {
    const parsedAmount = ethers.utils.parseEther(amount);
    const slippageMultiplier = 1 - slippage / 100;
    return parsedAmount.mul(Math.floor(slippageMultiplier * 1000)).div(1000);
};

export const buyPT = async (
    amount: string,
    wallet: any,
    slippage: number = 0.5
) => {
    if (!wallet.signer) throw new Error('No signer available');
    
    const router = getContract(
        PENDLE_ROUTER_ADDRESS,
        PendleRouterABI.abi,
        wallet.signer
    );

    const amountIn = ethers.utils.parseEther(amount);
    const minPtOut = calculateMinOutput(amount, slippage);

    // Approve WETH spending if needed
    const weth = getContract(
        BASE_TOKEN_ADDRESS,
        ['function approve(address spender, uint256 amount)'],
        wallet.signer
    );
    
    const approveTx = await weth.approve(PENDLE_ROUTER_ADDRESS, amountIn);
    await approveTx.wait();

    // Swap tokens for PT
    const tx = await router.swapExactTokenForPt(
        amountIn,
        PENDLE_MARKET_ADDRESS,
        BASE_TOKEN_ADDRESS,
        minPtOut,
        wallet.address,
        {
            gasLimit: 500000 // Adjust as needed
        }
    );
    
    return tx.wait();
};

export const sellPT = async (
    amount: string,
    wallet: any,
    slippage: number = 0.5
) => {
    if (!wallet.signer) throw new Error('No signer available');
    
    const router = getContract(
        PENDLE_ROUTER_ADDRESS,
        PendleRouterABI.abi,
        wallet.signer
    );

    const ptAmount = ethers.utils.parseEther(amount);
    const minTokenOut = calculateMinOutput(amount, slippage);

    // Approve PT token spending
    const ptToken = getContract(
        PENDLE_MARKET_ADDRESS,
        ['function approve(address spender, uint256 amount)'],
        wallet.signer
    );
    
    const approveTx = await ptToken.approve(PENDLE_ROUTER_ADDRESS, ptAmount);
    await approveTx.wait();

    // Swap PT for tokens
    const tx = await router.swapExactPtForToken(
        ptAmount,
        PENDLE_MARKET_ADDRESS,
        BASE_TOKEN_ADDRESS,
        ethers.constants.MaxUint256, // Max slippage for input token
        wallet.address,
        {
            gasLimit: 500000 // Adjust as needed
        }
    );
    
    return tx.wait();
};