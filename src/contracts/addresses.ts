import { ethers } from 'ethers';

// Helper to ensure addresses are always in checksum format
const checksumAddress = (address: string): string => ethers.utils.getAddress(address);

// Pendle contract addresses on Base network (all in checksum format)
export const PENDLE_ROUTER_ADDRESS = checksumAddress('0x00000000005BBB0EF59571E58418F9a4357b68A0'); // Router V3 on Base
export const PENDLE_MARKET_ADDRESS = checksumAddress('0x06B8976C97D2d2c1b36e527F795c7E91F2Ec1d94'); // Example PT market
export const WETH_ADDRESS = checksumAddress('0x4200000000000000000000000000000000000006'); // WETH on Base