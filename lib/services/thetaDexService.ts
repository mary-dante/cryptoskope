import { ethers } from 'ethers';
import { Theta } from '@thetalabs/theta-js';

// ThetaChain DEX contract addresses
const DEX_CONTRACT_ADDRESS = "0x2D65cf52EC55702eAee7ABF38e789e8E0048D7dD"; // pair contract
const TOKEN_ADDRESS = "0x4Dc08B15Ea0E10B96c41Aec22Fab934Ba15c983e"; // WTFUEL

// ABI for the DEX contract (minimal version for price feeds)
const DEX_ABI = [
    'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
    'function token0() external view returns (address)',
    'function token1() external view returns (address)'
];

export class ThetaDexService {
    private provider: ethers.providers.JsonRpcProvider;
    private dexContract: ethers.Contract;
    private pollInterval: NodeJS.Timeout | null = null;

    constructor() {
        // Connect to ThetaChain mainnet via HTTP
        this.provider = new ethers.providers.JsonRpcProvider('https://eth-rpc-api.thetatoken.org/rpc');
        this.dexContract = new ethers.Contract(DEX_CONTRACT_ADDRESS, DEX_ABI, this.provider);
    }

    async getTokenPrice(): Promise<number> {
        try {
            console.log('Fetching reserves...');
            const reserves = await this.dexContract.getReserves();
            console.log('Reserves:', reserves);
            const token0 = await this.dexContract.token0();
            console.log('Token0:', token0);
            // Calculate price based on reserves
            const reserve0 = ethers.utils.formatUnits(reserves.reserve0, 18);
            const reserve1 = ethers.utils.formatUnits(reserves.reserve1, 18);
            if (token0.toLowerCase() === TOKEN_ADDRESS.toLowerCase()) {
                return Number(reserve1) / Number(reserve0);
            } else {
                return Number(reserve0) / Number(reserve1);
            }
        } catch (error) {
            console.error('Error fetching token price:', error);
            throw error;
        }
    }

    subscribeToPriceUpdates(callback: (price: number) => void): () => void {
        // Poll every 10 seconds
        this.pollInterval = setInterval(async () => {
            try {
                const price = await this.getTokenPrice();
                callback(price);
            } catch (error) {
                console.error('Error in price update polling:', error);
            }
        }, 10000);

        // Also fetch immediately
        this.getTokenPrice().then(callback).catch(console.error);

        // Return cleanup function
        return () => {
            if (this.pollInterval) {
                clearInterval(this.pollInterval);
                this.pollInterval = null;
            }
        };
    }

    // Cleanup method
    disconnect() {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
        }
    }
} 