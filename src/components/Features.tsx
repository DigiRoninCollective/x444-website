import React from 'react';
import { Zap, Globe, Lock, Gauge, Layers, Code } from 'lucide-react';
import VoiceButton from './VoiceButton';
import { useVoice } from '../hooks/useVoice';

const features = [
  {
    icon: Zap,
    title: 'Gasless Transfers',
    description: 'EIP-3009 and EIP-2612 support for zero-gas-fee micropayments',
  },
  {
    icon: Globe,
    title: 'Multi-Chain',
    description: 'Deploy on Ethereum, Polygon, Optimism, Arbitrum, BNB, and Base',
  },
  {
    icon: Lock,
    title: 'Cryptographically Secure',
    description: 'EIP-712 signatures with replay protection and verification',
  },
  {
    icon: Gauge,
    title: 'Dynamic Pricing',
    description: 'Real-time pricing with oracle integration',
  },
  {
    icon: Layers,
    title: 'Modular Architecture',
    description: 'Flexible design for seamless protocol integration',
  },
  {
    icon: Code,
    title: 'Developer Friendly',
    description: 'Simple APIs and comprehensive documentation for rapid implementation',
  },
];

export default function Features() {
  const { isConfigured } = useVoice();

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Key Features</h2>
              <p className="text-lg text-gray-600">Everything you need for modern payment infrastructure</p>
            </div>
            {isConfigured && (
              <VoiceButton
                text="x4 Protocol features. Gasless transfers, multi-chain support, cryptographically secure transactions, dynamic pricing, modular architecture, and developer friendly APIs."
                variant="icon"
                tooltipText="Listen to features"
                className="text-x4-gold-600 mt-2"
              />
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="card group relative">
                <Icon className="w-8 h-8 text-primary-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
                {isConfigured && (
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <VoiceButton
                      text={`${feature.title}. ${feature.description}`}
                      variant="icon"
                      tooltipText={`Listen to ${feature.title}`}
                      className="text-x4-gold-500 text-sm"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
