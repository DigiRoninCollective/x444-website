import React from 'react';
import { CheckCircle } from 'lucide-react';

const specs = {
  'ERC-20 Standards': [
    'Standard approve + transferFrom',
    'EIP-3009 (Transfer with Authorization)',
    'EIP-2612 (Permit-based)',
  ],
  'Networks': [
    'Ethereum (mainnet & sepolia)',
    'Polygon (mainnet & mumbai)',
    'Optimism (mainnet & sepolia)',
    'Arbitrum (mainnet & sepolia)',
    'BNB Chain (mainnet & testnet)',
    'Base (mainnet & sepolia)',
    'Solana (mainnet & devnet)',
  ],
  'Security': [
    'EIP-712 Typed Signature Hashing',
    'Nonce-based replay protection',
    'Signature verification',
    'Timestamp validation',
  ],
  'Pricing Models': [
    'Fixed USD pricing (stablecoins)',
    'Dynamic pricing (memecoins)',
    'Real-time oracle integration',
    'Slippage tolerance',
  ],
};

export default function Specs() {
  return (
    <section id="specs" className="py-20 px-6 bg-gradient-to-b from-dark-800 to-transparent bg-opacity-30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Technical <span className="gradient-text">Specifications</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {Object.entries(specs).map(([category, items]) => (
            <div key={category} className="card">
              <h3 className="text-2xl font-bold mb-6 gradient-text">{category}</h3>
              <ul className="space-y-4">
                {items.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="text-cyber-500 flex-shrink-0 mt-1" size={20} />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
