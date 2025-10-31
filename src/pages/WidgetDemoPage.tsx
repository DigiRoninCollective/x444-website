import React, { useState } from 'react';
import { Copy, CheckCircle2, AlertCircle } from 'lucide-react';
import X444PaymentWidget from '../components/X444PaymentWidget';

const DEMO_CONFIG = {
  linkId: 'demo_nft_rare_1',
  contractAddress: '0x0000000000000000000000000000000000000000', // Placeholder - replace with actual
  contractABI: [], // Load from your backend
  supportedTokens: [
    {
      address: '0x0000000000000000000000000000000000000001',
      symbol: 'X4',
      name: 'X4 Token',
      decimals: 18,
      logo: '🪙'
    },
    {
      address: '0x0000000000000000000000000000000000000002',
      symbol: 'DOGE',
      name: 'Dogecoin',
      decimals: 8,
      logo: '🐕'
    }
  ],
  faciliorApiEndpoint: process.env.REACT_APP_FACILITATOR_API || 'http://localhost:3000',
};

export default function WidgetDemoPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showWidget, setShowWidget] = useState(true);

  const copyToClipboard = (code: string, label: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(label);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const reactCode = `import { X444PaymentWidget } from './components/X444PaymentWidget';
import X444_ABI from './abi/X444PaymentCoreGasless.json';

export default function MyNFTPage() {
  return (
    <X444PaymentWidget
      linkId="nft_drop_1"
      contractAddress="0xYourX444Address"
      contractABI={X444_ABI}
      supportedTokens={[
        {
          address: '0xX4Token',
          symbol: 'X4',
          name: 'X4 Token',
          decimals: 18
        },
        {
          address: '0xDogeAddress',
          symbol: 'DOGE',
          name: 'Dogecoin',
          decimals: 8
        }
      ]}
      faciliorApiEndpoint="https://your-api.com"
      isGasless={true}
      theme="dark"
      onPaymentSuccess={(txHash, amount) => {
        console.log('Payment successful!', txHash);
        // Deliver your product/NFT
      }}
      onPaymentError={(error) => {
        console.error('Payment failed:', error);
      }}
    />
  );
}`;

  const vanillaCode = `<!-- Add ethers.js -->
<script src="https://cdn.ethers.org/v6/ethers.umd.min.js"><\/script>

<!-- Add X444 Widget -->
<script src="https://cdn.x444.io/widget.js"><\/script>

<div id="x444-payment"
  data-link-id="nft_drop_1"
  data-contract="0xYourX444ContractAddress"
  data-tokens='[
    {"address":"0xX4Token","symbol":"X4","name":"X4 Token","decimals":18},
    {"address":"0xDoge","symbol":"DOGE","name":"Dogecoin","decimals":8}
  ]'
  data-theme="light"
  data-gasless="true"
></div>

<script>
  X444Widget.init({
    containerId: 'x444-payment',
    linkId: 'nft_drop_1',
    contractAddress: '0xYourX444ContractAddress',
    contractABI: X444_ABI,
    tokens: [
      { address: '0xX4', symbol: 'X4', decimals: 18 },
      { address: '0xDoge', symbol: 'DOGE', decimals: 8 }
    ],
    faciliorApiEndpoint: 'https://your-api.com',
    onPaymentSuccess: (txHash, amount) => {
      console.log('Payment successful:', txHash);
    },
    onPaymentError: (error) => {
      console.error('Payment failed:', error);
    }
  });
</script>`;

  return (
    <div className="space-y-32 py-20">
      {/* Header */}
      <section className="px-6 pt-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            <span className="gradient-text">Payment Widget</span>
          </h1>
          <p className="text-xl text-slate-300">
            The easiest way to accept memocoin payments. Drop it in, creators start earning instantly.
          </p>
        </div>
      </section>

      {/* Live Demo */}
      <section className="px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12">Live Demo</h2>

          {showWidget && (
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-8 mb-8">
              <div className="flex justify-between items-center mb-6">
                <p className="text-slate-400">This is the actual X444 Payment Widget:</p>
                <button
                  onClick={() => setShowWidget(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Hide Widget
                </button>
              </div>
              <div className="flex justify-center p-8 bg-slate-800/50 rounded-lg">
                <div className="w-full max-w-sm">
                  <X444PaymentWidget
                    {...DEMO_CONFIG}
                    theme="dark"
                    onPaymentSuccess={(txHash, amount) => {
                      alert(`Demo payment successful! (Simulated)\nTx: ${txHash}\nAmount: ${amount}`);
                    }}
                    onPaymentError={(error) => {
                      console.error('Demo payment error:', error);
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {!showWidget && (
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-8 mb-8 text-center">
              <p className="text-slate-400 mb-4">Widget hidden</p>
              <button
                onClick={() => setShowWidget(true)}
                className="px-6 py-2 bg-x4-gold-500 hover:bg-x4-gold-600 text-white rounded-lg transition-colors"
              >
                Show Widget
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Integration Guide */}
      <section className="px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12">Integration Guide</h2>

          {/* Features */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {[
              {
                title: '🚀 Plug & Play',
                desc: 'Drop the widget into your site in minutes. Zero configuration needed.'
              },
              {
                title: '💨 Gasless Payments',
                desc: 'Customers pay zero gas. You pay ~$0.20 per transaction and earn 1%.'
              },
              {
                title: '🪙 Multiple Tokens',
                desc: 'Accept X4, DOGE, USDC, or any BEP-20 token your customers hold.'
              },
              {
                title: '🎨 Light & Dark Themes',
                desc: 'Matches your branding. Automatic dark mode detection.'
              },
              {
                title: '⚡ React Ready',
                desc: 'Native React component with TypeScript support for modern apps.'
              },
              {
                title: '🔗 Vanilla JS Compatible',
                desc: 'Works anywhere. No dependencies. Simple HTML + script tags.'
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-slate-700/50 hover:border-x4-gold-500/50 rounded-xl transition-all"
              >
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Code Examples */}
          <div className="space-y-8">
            {/* React */}
            <div className="border border-slate-700/50 rounded-xl p-8 bg-slate-900/30">
              <h3 className="text-xl font-bold text-white mb-4">React Component</h3>
              <p className="text-slate-400 mb-4">
                For modern React applications with TypeScript support.
              </p>
              <div className="bg-slate-900 rounded-lg p-4 mb-4 relative">
                <button
                  onClick={() => copyToClipboard(reactCode, 'react')}
                  className="absolute top-4 right-4 p-2 hover:bg-slate-800 rounded-lg transition-colors"
                  title="Copy to clipboard"
                >
                  {copiedCode === 'react' ? (
                    <CheckCircle2 size={20} className="text-green-400" />
                  ) : (
                    <Copy size={20} className="text-slate-400 hover:text-slate-200" />
                  )}
                </button>
                <pre className="text-sm text-slate-300 overflow-x-auto">
                  <code>{reactCode}</code>
                </pre>
              </div>
              <div className="text-sm text-slate-400">
                <p className="mb-2">Installation:</p>
                <code className="bg-slate-800 px-3 py-2 rounded text-x4-gold-300">npm install @x444/widget ethers</code>
              </div>
            </div>

            {/* Vanilla JS */}
            <div className="border border-slate-700/50 rounded-xl p-8 bg-slate-900/30">
              <h3 className="text-xl font-bold text-white mb-4">Vanilla JavaScript</h3>
              <p className="text-slate-400 mb-4">
                Works on any website. No build tools required. Works with WordPress, Webflow, etc.
              </p>
              <div className="bg-slate-900 rounded-lg p-4 mb-4 relative">
                <button
                  onClick={() => copyToClipboard(vanillaCode, 'vanilla')}
                  className="absolute top-4 right-4 p-2 hover:bg-slate-800 rounded-lg transition-colors"
                  title="Copy to clipboard"
                >
                  {copiedCode === 'vanilla' ? (
                    <CheckCircle2 size={20} className="text-green-400" />
                  ) : (
                    <Copy size={20} className="text-slate-400 hover:text-slate-200" />
                  )}
                </button>
                <pre className="text-sm text-slate-300 overflow-x-auto">
                  <code>{vanillaCode}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Configuration */}
      <section className="px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12">Configuration Options</h2>

          <div className="space-y-4">
            {[
              {
                name: 'linkId',
                type: 'string',
                required: true,
                desc: 'Unique identifier for this payment link'
              },
              {
                name: 'contractAddress',
                type: 'string',
                required: true,
                desc: 'Address of X444PaymentCore or X444PaymentCoreGasless contract'
              },
              {
                name: 'contractABI',
                type: 'object[]',
                required: true,
                desc: 'ABI of the payment contract'
              },
              {
                name: 'supportedTokens',
                type: 'Token[]',
                required: true,
                desc: 'Array of tokens customers can pay with'
              },
              {
                name: 'faciliorApiEndpoint',
                type: 'string',
                required: false,
                desc: 'Your backend API endpoint for gasless payments'
              },
              {
                name: 'isGasless',
                type: 'boolean',
                required: false,
                desc: 'Enable gasless payments (default: true)'
              },
              {
                name: 'theme',
                type: '"light" | "dark"',
                required: false,
                desc: 'Widget theme (default: "light")'
              },
              {
                name: 'onPaymentSuccess',
                type: 'function',
                required: false,
                desc: 'Callback when payment succeeds (txHash, amount) => void'
              },
              {
                name: 'onPaymentError',
                type: 'function',
                required: false,
                desc: 'Callback when payment fails (error) => void'
              }
            ].map((option, i) => (
              <div
                key={i}
                className="p-4 bg-slate-900/50 border border-slate-700/50 rounded-lg hover:border-slate-600/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <code className="text-x4-gold-300 font-semibold">{option.name}</code>
                      <span className="text-xs px-2 py-1 bg-slate-800 rounded text-slate-300">
                        {option.type}
                      </span>
                      {option.required && (
                        <span className="text-xs px-2 py-1 bg-red-900/30 text-red-400 rounded border border-red-700/50">
                          required
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 text-sm">{option.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12">Frequently Asked Questions</h2>

          <div className="space-y-6">
            {[
              {
                q: 'How much does the widget cost?',
                a: 'The widget is free to use. You only pay transaction fees: 1% goes to you (operator), 0.5% to community treasury, 98.5% to the creator.'
              },
              {
                q: 'Can customers really pay zero gas?',
                a: 'Yes! With gasless payments, customers sign a message (costs $0). You submit it on-chain (costs ~$0.20). Customers pay ZERO gas.'
              },
              {
                q: 'What tokens can I accept?',
                a: 'Any BEP-20 token. By default, X4, DOGE, and USDC. You can add custom tokens via governance voting.'
              },
              {
                q: 'How do I get paid?',
                a: '1% of every payment goes directly to your wallet automatically. No manual work needed.'
              },
              {
                q: 'Do I need a backend for gasless?',
                a: 'For true gasless, yes - you need a simple Node.js server to relay transactions. We provide example code and SDKs.'
              },
              {
                q: 'Works on WordPress / Webflow / other platforms?',
                a: 'Yes! Use the vanilla JavaScript version. Just paste the script tags and you\'re done.'
              }
            ].map((item, i) => (
              <div key={i} className="border border-slate-700/50 rounded-lg p-6 bg-slate-900/30 hover:border-slate-600/50 transition-colors">
                <h3 className="text-lg font-semibold text-white mb-3">{item.q}</h3>
                <p className="text-slate-400">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-x4-gold-500/20 to-amber-500/20 border border-x4-gold-500/40 rounded-xl p-12">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Accept Memocoin Payments?</h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Copy the code above, customize it for your product, and you're done. Your customers can start paying with memecoins in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/docs"
                className="px-8 py-3 bg-x4-gold-500 hover:bg-x4-gold-600 text-white rounded-lg font-semibold transition-colors"
              >
                Read Full Documentation
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
