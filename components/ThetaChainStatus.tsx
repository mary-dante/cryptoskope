import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const RPC_URL = 'https://eth-rpc-api.thetatoken.org/rpc';
const DEX_CONTRACT = '0x2D65cf52EC55702eAee7ABF38e789e8E0048D7dD';
const TOKEN_ADDRESS = '0x4Dc08B15Ea0E10B96c41Aec22Fab934Ba15c983e';

export const ThetaChainStatus: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'connected' | 'disconnected'>('loading');

  useEffect(() => {
    const checkConnection = async () => {
      setStatus('loading');
      try {
        const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
        // Try to get the latest block number as a simple connectivity check
        await provider.getBlockNumber();
        setStatus('connected');
      } catch (err) {
        setStatus('disconnected');
      }
    };
    checkConnection();
  }, []);

  return (
    <div className="flex items-center gap-3 p-4 bg-black/60 rounded-lg border border-blue-900 flex-wrap">
      {status === 'loading' ? (
        <span className="inline-block w-3 h-3 rounded-full bg-yellow-400 animate-pulse"></span>
      ) : status === 'connected' ? (
        <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
      ) : (
        <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
      )}
      <span className={`font-medium ${status === 'connected' ? 'text-green-300' : status === 'loading' ? 'text-yellow-200' : 'text-red-400'}`}>{
        status === 'loading' ? 'Checking ThetaChain connection...' : status === 'connected' ? 'Connected to ThetaChain' : 'Not connected to ThetaChain'
      }</span>
      <span className="text-xs text-blue-200 ml-4">Network: Mainnet</span>
      <span className="text-xs text-blue-200 ml-4">RPC: {RPC_URL}</span>
      <span className="text-xs text-blue-200 ml-4">DEX Contract: {DEX_CONTRACT}</span>
      <span className="text-xs text-blue-200 ml-4 break-all">Token Address: {TOKEN_ADDRESS}</span>
    </div>
  );
}; 