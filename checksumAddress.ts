import { ethers } from 'ethers';
import { PENDLE_ROUTER_ADDRESS, PENDLE_MARKET_ADDRESS, WETH_ADDRESS } from './src/contracts/addresses';

const getChecksumAddresses = () => {
    console.log('Router:', PENDLE_ROUTER_ADDRESS);
    console.log('Market:', PENDLE_MARKET_ADDRESS);
    console.log('WETH:', WETH_ADDRESS);
};

getChecksumAddresses();
