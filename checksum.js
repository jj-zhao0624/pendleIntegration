const { ethers } = require('ethers');

const getChecksumAddresses = () => {
    const routerAddress = '0x0000a0783f0F26585F1578bB02218e9e4B87714e';
    const marketAddress = '0x24E4df37Ea00c4954d668E3Ce19FFE25A3D36f9A';
    
    console.log('Router:', ethers.getAddress(routerAddress));
    console.log('Market:', ethers.getAddress(marketAddress));
};

getChecksumAddresses();
