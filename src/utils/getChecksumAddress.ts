import { ethers } from 'ethers';
import { PENDLE_ROUTER_ADDRESS, PENDLE_MARKET_ADDRESS, WETH_ADDRESS } from '../contracts/addresses';

const addresses = {
    router: PENDLE_ROUTER_ADDRESS,
    market: PENDLE_MARKET_ADDRESS,
    weth: WETH_ADDRESS
};

Object.entries(addresses).forEach(([name, address]) => {
    try {
        const checksummed = ethers.utils.getAddress(address);
        console.log(`${name}:`, checksummed);
    } catch (error) {
        console.error(`Error with ${name}:`, error);
    }
});
