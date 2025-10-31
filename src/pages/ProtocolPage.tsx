import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function ProtocolPage() {
  return (
    <div className="space-y-32 py-20">
      {/* Header */}
      <section className="px-6 pt-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-x4-gold-400 mb-6">
            Protocol Specifications
          </h1>
          <p className="text-xl text-x4-silver-400">
            Deep dive into the x4 Protocol architecture, implementation details, and technical specifications.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-x4-gold-400 mb-12">How It Works</h2>
          <div className="space-y-6">
            {[
              { step: 1, title: 'Request', desc: 'Client initiates payment request with x4 parameters' },
              { step: 2, title: 'Sign', desc: 'User signs transaction using EIP-712 standard' },
              { step: 3, title: 'Relay', desc: 'Signed transaction relayed to payment processor' },
              { step: 4, title: 'Execute', desc: 'Contract executes payment atomically' },
              { step: 5, title: 'Settle', desc: 'Funds transferred in <1 second' },
            ].map((item, i) => (
              <div
                key={i}
                className="flex gap-6 p-6 bg-gradient-to-r from-slate-900/80 to-slate-900/60 border border-x4-gold-500/20 rounded-lg hover:border-x4-gold-500/50 transition-all"
              >
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-x4-gold-500 to-x4-gold-600 border border-x4-gold-400/50">
                    <span className="text-lg font-bold text-slate-900">{item.step}</span>
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-x4-gold-300 mb-1">{item.title}</h3>
                  <p className="text-x4-silver-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section className="px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-x4-gold-400 mb-12">Technical Specs</h2>

          <div className="space-y-8">
            {/* Standards */}
            <div className="border border-x4-gold-500/30 rounded-lg p-8 bg-slate-900/50">
              <h3 className="text-xl font-bold text-x4-gold-400 mb-4">Standards</h3>
              <div className="space-y-2">
                {['EIP-712: Typed Structured Data Hashing', 'EIP-2612: Permit Extension', 'EIP-3009: ERC-20 Transfer with authorization'].map((std, i) => (
                  <div key={i} className="flex items-center gap-3 text-x4-silver-400">
                    <CheckCircle2 className="w-5 h-5 text-x4-gold-400 flex-shrink-0" />
                    {std}
                  </div>
                ))}
              </div>
            </div>

            {/* Networks */}
            <div className="border border-x4-gold-500/30 rounded-lg p-8 bg-slate-900/50">
              <h3 className="text-xl font-bold text-x4-gold-400 mb-4">Supported Networks</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['Ethereum', 'Polygon', 'Optimism', 'Arbitrum', 'BNB Chain', 'Base'].map((net, i) => (
                  <div key={i} className="px-4 py-2 bg-slate-900/50 border border-x4-gold-500/20 hover:border-x4-gold-500/50 rounded-lg text-x4-silver-400 text-sm transition-colors">
                    {net}
                  </div>
                ))}
              </div>
            </div>

            {/* Security */}
            <div className="border border-x4-gold-500/30 rounded-lg p-8 bg-slate-900/50">
              <h3 className="text-xl font-bold text-x4-gold-400 mb-4">Security Features</h3>
              <div className="space-y-2">
                {['Replay protection with nonce tracking', 'EIP-712 signature validation', 'Rate limiting per account', 'Emergency pause mechanism'].map((sec, i) => (
                  <div key={i} className="flex items-center gap-3 text-x4-silver-400">
                    <CheckCircle2 className="w-5 h-5 text-x4-gold-400 flex-shrink-0" />
                    {sec}
                  </div>
                ))}
              </div>
            </div>

            {/* EIP-3009 Gasless Mechanics */}
            <div className="border border-x4-gold-500/40 rounded-lg p-8 bg-gradient-to-br from-x4-gold-500/10 to-slate-900/50">
              <h3 className="text-xl font-bold text-x4-gold-400 mb-4">EIP-3009 Gasless Mechanics</h3>
              <div className="space-y-4 text-x4-silver-400">
                <p>
                  Users pay <span className="text-x4-gold-400 font-semibold">ZERO gas fees</span> while merchants pay only <span className="text-x4-gold-400 font-semibold">~$0.20 per transaction</span> on BNB Chain.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-x4-gold-500/20 border border-x4-gold-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-bold text-x4-gold-300">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-x4-gold-300 mb-1">User Signs Authorization</h4>
                      <p className="text-sm text-x4-silver-400">User cryptographically signs payment using EIP-712 typed data (no gas)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-x4-gold-500/20 border border-x4-gold-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-bold text-x4-gold-300">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-x4-gold-300 mb-1">Relay to Facilitator</h4>
                      <p className="text-sm text-x4-silver-400">Signed authorization sent to payment facilitator (off-chain)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-x4-gold-500/20 border border-x4-gold-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-bold text-x4-gold-300">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-x4-gold-300 mb-1">Facilitator Executes</h4>
                      <p className="text-sm text-x4-silver-400">Facilitator calls <code className="text-x4-gold-300 bg-slate-800/50 px-2 py-1 rounded text-xs">transferWithAuthorization()</code> on-chain (merchant pays gas)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-x4-gold-500/20 border border-x4-gold-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-bold text-x4-gold-300">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-x4-gold-300 mb-1">Instant Settlement</h4>
                      <p className="text-sm text-x4-silver-400">Tokens transferred directly to merchant in &lt;1 second (non-custodial)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Governance */}
      <section className="px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-x4-gold-400 mb-12">AI-Driven Governance</h2>

          <div className="space-y-8">
            {/* AI Governance Overview */}
            <div className="border border-x4-gold-500/40 rounded-lg p-8 bg-gradient-to-br from-x4-gold-500/10 to-slate-900/50">
              <h3 className="text-xl font-bold text-x4-gold-400 mb-4">Next-Generation Protocol Governance</h3>
              <p className="text-x4-silver-400 mb-6">
                The x4 Protocol incorporates cutting-edge AI technology to enable intelligent, adaptive governance that evolves with the ecosystem. Unlike traditional voting mechanisms, AI-driven governance provides real-time optimization and decision-making.
              </p>
              <div className="space-y-3">
                {[
                  'Real-time protocol parameter adjustment based on network conditions',
                  'Intelligent fee discovery using dynamic pricing algorithms',
                  'Automated security monitoring and threat detection',
                  'Predictive token economics optimization',
                  'Continuous ecosystem health assessment'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-x4-silver-400">
                    <CheckCircle2 className="w-5 h-5 text-x4-gold-400 flex-shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* AI Components */}
            <div className="border border-x4-gold-500/30 rounded-lg p-8 bg-slate-900/50">
              <h3 className="text-xl font-bold text-x4-gold-400 mb-6">Core AI Components</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-x4-gold-300 mb-2">Smart Contract Audit AI</h4>
                  <p className="text-x4-silver-400 text-sm">Continuously analyzes smart contract code for vulnerabilities, gas optimization opportunities, and compliance issues before deployment.</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-x4-gold-300 mb-2">Dynamic Fee Optimizer</h4>
                  <p className="text-x4-silver-400 text-sm">Uses machine learning to predict optimal transaction fees based on network congestion, token volatility, and user demand patterns.</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-x4-gold-300 mb-2">Security Sentinel</h4>
                  <p className="text-x4-silver-400 text-sm">Real-time anomaly detection identifies suspicious transaction patterns, potential MEV attacks, and flash loan exploits instantly.</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-x4-gold-300 mb-2">Token Economics Engine</h4>
                  <p className="text-x4-silver-400 text-sm">Analyzes X4 token utility, distribution, and governance implications to recommend protocol adjustments for optimal ecosystem health.</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-x4-gold-300 mb-2">Oracle Intelligence</h4>
                  <p className="text-x4-silver-400 text-sm">Intelligent oracle aggregation using AI to weight data sources by reliability, filter outliers, and detect price manipulation.</p>
                </div>
              </div>
            </div>

            {/* Governance Flow */}
            <div className="border border-x4-gold-500/30 rounded-lg p-8 bg-slate-900/50">
              <h3 className="text-xl font-bold text-x4-gold-400 mb-6">AI Governance Decision Flow</h3>
              <div className="space-y-4">
                {[
                  { step: 1, title: 'Data Collection', desc: 'AI analyzes real-time protocol metrics, market conditions, and ecosystem health indicators' },
                  { step: 2, title: 'Analysis', desc: 'Machine learning models identify trends, risks, and optimization opportunities' },
                  { step: 3, title: 'Recommendation', desc: 'AI generates governance recommendations with confidence scores and impact analysis' },
                  { step: 4, title: 'Community Review', desc: 'X4 token holders review AI recommendations via governance dashboard' },
                  { step: 5, title: 'Execution', desc: 'Approved recommendations automatically execute on-chain via governance smart contracts' },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4 p-4 bg-gradient-to-r from-slate-900/50 to-slate-900/30 rounded-lg border border-x4-gold-500/20">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-x4-gold-500/20 border border-x4-gold-500/40">
                        <span className="text-sm font-bold text-x4-gold-300">{item.step}</span>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-semibold text-x4-gold-300 mb-1">{item.title}</h4>
                      <p className="text-sm text-x4-silver-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Benefits */}
            <div className="border border-x4-gold-500/30 rounded-lg p-8 bg-slate-900/50">
              <h3 className="text-xl font-bold text-x4-gold-400 mb-6">Advantages Over Traditional Governance</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900/50 rounded-lg border border-x4-gold-500/20">
                  <p className="font-semibold text-x4-gold-300 mb-2">Speed</p>
                  <p className="text-sm text-x4-silver-400">AI makes decisions in milliseconds vs. days/weeks of voting</p>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-lg border border-x4-gold-500/20">
                  <p className="font-semibold text-x4-gold-300 mb-2">Data-Driven</p>
                  <p className="text-sm text-x4-silver-400">Decisions based on comprehensive analysis vs. sentiment</p>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-lg border border-x4-gold-500/20">
                  <p className="font-semibold text-x4-gold-300 mb-2">Predictive</p>
                  <p className="text-sm text-x4-silver-400">AI forecasts outcomes before implementation</p>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-lg border border-x4-gold-500/20">
                  <p className="font-semibold text-x4-gold-300 mb-2">Adaptive</p>
                  <p className="text-sm text-x4-silver-400">Continuously learns and improves decision quality</p>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-lg border border-x4-gold-500/20">
                  <p className="font-semibold text-x4-gold-300 mb-2">Transparent</p>
                  <p className="text-sm text-x4-silver-400">All AI reasoning and recommendations fully auditable on-chain</p>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-lg border border-x4-gold-500/20">
                  <p className="font-semibold text-x4-gold-300 mb-2">Community Control</p>
                  <p className="text-sm text-x4-silver-400">X4 holders always have final veto authority over AI decisions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
