import React from 'react';
import { ArrowRight } from 'lucide-react';
import VoiceButton from './VoiceButton';
import { useVoice } from '../hooks/useVoice';

const steps = [
  {
    number: '01',
    title: 'Client Requests',
    description: 'User accesses API endpoint without payment',
    details: 'The client sends a standard HTTP request to a protected endpoint.',
  },
  {
    number: '02',
    title: 'Server Responds 402',
    description: 'Server returns HTTP 402 with payment requirements',
    details: 'Server includes payment details: network, token, amount, recipient, etc.',
  },
  {
    number: '03',
    title: 'Client Signs',
    description: 'Client wallet signs EIP-712 message',
    details: 'No gas fees. Signature proves ownership and authorization.',
  },
  {
    number: '04',
    title: 'Payment Verified',
    description: 'Server validates signature and amount',
    details: 'Cryptographic verification ensures legitimate payment intent.',
  },
  {
    number: '05',
    title: 'Transfer Settled',
    description: 'Facilitator executes on-chain transfer',
    details: 'Tokens move directly from user to recipient wallet.',
  },
  {
    number: '06',
    title: 'Resource Access',
    description: 'Server grants access, client receives data',
    details: 'Standard HTTP 200 response with requested resource.',
  },
];

export default function HowItWorks() {
  const { isConfigured } = useVoice();

  return (
    <section id="how-it-works" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <h2 className="text-4xl md:text-5xl font-bold">
              How <span className="gradient-text">x444 Works</span>
            </h2>
            {isConfigured && (
              <VoiceButton
                text="How x444 works. A six step process: client requests, server responds with 402 payment required, client signs with EIP-712, payment gets verified, transfer is settled on chain, and resource access is granted."
                variant="icon"
                tooltipText="Listen to how it works"
                className="text-x4-gold-400"
              />
            )}
          </div>
          <p className="text-xl text-gray-400">
            A seamless flow from request to payment to resource access
          </p>
        </div>

        {/* Steps Flow */}
        <div className="space-y-6">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div className="card p-8 hover:neon-glow group relative">
                <div className="flex items-start gap-8">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-br from-primary-600 to-accent-600">
                      <span className="text-2xl font-bold text-white">{step.number}</span>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                    <p className="text-gray-400 mb-2">{step.description}</p>
                    <p className="text-sm text-primary-400">{step.details}</p>
                  </div>
                  {isConfigured && (
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <VoiceButton
                        text={`Step ${step.number}: ${step.title}. ${step.description}. ${step.details}`}
                        variant="icon"
                        tooltipText={`Listen to step ${step.number}`}
                        className="text-x4-gold-400"
                      />
                    </div>
                  )}
                </div>
              </div>

              {index < steps.length - 1 && (
                <div className="flex justify-center">
                  <ArrowRight size={32} className="text-primary-500 transform rotate-90" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Code Example */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold mb-6">Implementation Example</h3>
          <pre className="overflow-auto">
{`// Client-side: Making a payment request
import { X444Client, createX444Client } from '@zcdos/x444';

const client = await createX444Client('https://api.example.com');
await client.connectWallet();

// Automatic payment interception
const response = await client.fetch('/api/premium-data');
const data = await response.json();`}
          </pre>
        </div>
      </div>
    </section>
  );
}
