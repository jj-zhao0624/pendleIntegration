import { ethers } from 'ethers';
import { 
    PENDLE_MARKET_ADDRESS, 
    PENDLE_ROUTER_ADDRESS,
    WETH_ADDRESS 
} from '../contracts/addresses';
import PendleRouterABI from '../contracts/abis/PendleRouter.json';

// Pendle Router Structs
interface SwapData {
    swapData: string;
}

interface TokenInput {
    tokenIn: string;      // Token that user starts with
    netTokenIn: ethers.BigNumber;  // Amount of token
    tokenMintSy: string;  // Token used to mint SY
    pendleSwap: string;   // Address of swap helper
    swapData: SwapData;   // Data for swap
}

interface TokenOutput {
    tokenOut: string;     // Token user receives
    minTokenOut: ethers.BigNumber;  // Minimum amount to receive
    tokenRedeemSy: string;  // Token used to redeem SY
    pendleSwap: string;     // Address of swap helper
    swapData: SwapData;     // Data for swap
}

interface ApproxParams {
    guessMin: ethers.BigNumber;
    guessMax: ethers.BigNumber;
    guessOffchain: ethers.BigNumber;
    maxIteration: number;
    eps: ethers.BigNumber;
}

interface LimitOrderData {
    limitRouter: string;
    epsSkipMarket: ethers.BigNumber;
    normalFills: any[];
    flashFills: any[];
    optData: string;
}

// Helper functions to create structs
const createDefaultApproxParams = (): ApproxParams => ({
    guessMin: ethers.BigNumber.from(0),
    guessMax: ethers.constants.MaxUint256,
    guessOffchain: ethers.BigNumber.from(0),
    maxIteration: 256,
    eps: ethers.utils.parseUnits('0.0001', 18) // 1e14 = 0.01% max unused
});

const createTokenInputSimple = (tokenIn: string, amount: ethers.BigNumber): TokenInput => ({
    tokenIn,
    netTokenIn: amount,
    tokenMintSy: tokenIn,  // No aggregator, so tokenIn = tokenMintSy
    pendleSwap: ethers.constants.AddressZero,  // No aggregator
    swapData: { swapData: "0x" }  // Empty swap data
});

const createTokenOutputSimple = (tokenOut: string, minAmount: ethers.BigNumber): TokenOutput => ({
    tokenOut,
    minTokenOut: minAmount,
    tokenRedeemSy: tokenOut,  // No aggregator, so tokenOut = tokenRedeemSy
    pendleSwap: ethers.constants.AddressZero,  // No aggregator
    swapData: { swapData: "0x" }  // Empty swap data
});

const createEmptyLimitOrderData = (): LimitOrderData => ({
    limitRouter: ethers.constants.AddressZero,
    epsSkipMarket: ethers.BigNumber.from(0),
    normalFills: [],
    flashFills: [],
    optData: "0x"
});

// Helper function to ensure addresses are checksummed
const validateAndChecksumAddress = (address: string): string => {
    try {
        const cleanAddress = address.trim().toLowerCase();
        const properAddress = cleanAddress.startsWith('0x') ? cleanAddress : `0x${cleanAddress}`;
        
        // For certain addresses, return them as is
        if (properAddress === PENDLE_MARKET_ADDRESS.toLowerCase()) {
            return PENDLE_MARKET_ADDRESS;
        }
        if (properAddress === PENDLE_ROUTER_ADDRESS.toLowerCase()) {
            return PENDLE_ROUTER_ADDRESS;
        }
        if (properAddress === WETH_ADDRESS.toLowerCase()) {
            return WETH_ADDRESS;
        }
        
        return properAddress;
    } catch (error) {
        console.error(`Address validation error for ${address}:`, error);
        return address;
    }
};

export const calculateMinOutput = (amount: string, slippage: number): ethers.BigNumber => {
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
    
    // Ensure addresses are checksummed and valid
    const routerAddress = validateAndChecksumAddress(PENDLE_ROUTER_ADDRESS);
    const marketAddress = validateAndChecksumAddress(PENDLE_MARKET_ADDRESS);
    const wethAddress = validateAndChecksumAddress(WETH_ADDRESS);
    
    console.log('Using addresses:', {
        router: routerAddress,
        market: marketAddress,
        weth: wethAddress
    });

    const router = new ethers.Contract(
        routerAddress,
        PendleRouterABI.abi,
        wallet.signer
    );

    const amountIn = ethers.utils.parseEther(amount);
    const minPtOut = calculateMinOutput(amount, slippage);

    // First, check if user has enough balance
    const balance = await wallet.provider.getBalance(wallet.address);
    if (balance.lt(amountIn)) {
        throw new Error(`Insufficient balance. You have ${ethers.utils.formatEther(balance)} ETH, needed ${amount} ETH`);
    }

    // Create parameters for swap
    const tokenInput = {
        tokenIn: wethAddress,
        netTokenIn: amountIn,
        tokenMintSy: wethAddress,
        pendleSwap: ethers.constants.AddressZero,
        swapData: { swapData: "0x" }
    };

    const tokenOutput = {
        tokenOut: marketAddress,
        minTokenOut: minPtOut,
        tokenRedeemSy: marketAddress,
        pendleSwap: ethers.constants.AddressZero,
        swapData: { swapData: "0x" }
    };

    const approxParams = {
        guessMin: ethers.BigNumber.from(0),
        guessMax: ethers.constants.MaxUint256,
        guessOffchain: ethers.BigNumber.from(0),
        maxIteration: 256,
        eps: ethers.utils.parseUnits('0.001', 18)  // 0.1% precision
    };

    console.log('Executing swap with params:', {
        tokenInput,
        tokenOutput,
        approxParams,
        gasLimit: 500000
    });

    try {
        const tx = await router.swapExactTokenForPt(
            tokenInput,
            tokenOutput,
            approxParams,
            {
                gasLimit: 500000,
                value: amountIn // Need to send ETH with the transaction
            }
        );
        
        console.log('Transaction submitted:', tx.hash);
        return await tx.wait();
    } catch (error) {
        console.error('Swap failed:', error);
        throw error;
    }
};

// Simple implementation for sell PT
export const sellPT = async (
    amount: string,
    wallet: any,
    slippage: number = 0.5
) => {
    if (!wallet.signer) throw new Error('No signer available');
    
    // Use the addresses directly as they are already properly formatted
    const routerAddress = PENDLE_ROUTER_ADDRESS;
    const marketAddress = PENDLE_MARKET_ADDRESS;
    const wethAddress = WETH_ADDRESS;
    
    const router = new ethers.Contract(
        routerAddress,
        PendleRouterABI.abi,
        wallet.signer
    );

    const ptAmount = ethers.utils.parseEther(amount);
    const maxTokenOut = calculateMinOutput(amount, slippage);

    console.log('Selling PT with parameters:', {
        netPtOut: ptAmount.toString(),
        market: marketAddress,
        tokenIn: wethAddress,
        maxTokenIn: maxTokenOut.toString(),
        receiver: wallet.address
    });

    try {
        const tx = await router.swapExactPtForToken(
            ptAmount,      // netPtOut - amount of PT to sell
            marketAddress, // market - market address
            wethAddress,   // tokenIn - token to receive (WETH)
            maxTokenOut,   // maxTokenIn - maximum token amount (for slippage protection)
            wallet.address, // receiver - address to receive tokens
            {
                gasLimit: 500000
            }
        );
        
        console.log('Transaction submitted:', tx.hash);
        return await tx.wait();
    } catch (error) {
        console.error('Sell PT failed:', error);
        throw error;
    }
};