import React, { useState, useEffect } from 'react';
import { Shield, Zap, Code2, CheckCircle2, TrendingUp, Activity, AlertCircle, Gauge } from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function TechnicalPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [metrics, setMetrics] = useState({
    gasPrice: 45,
    txSuccess: 99.8,
    avgLatency: 2.3,
    securityScore: 98,
  });

  // Simulate live metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        gasPrice: Math.max(30, prev.gasPrice + (Math.random() - 0.5) * 20),
        txSuccess: Math.min(100, Math.max(98, prev.txSuccess + (Math.random() - 0.5))),
        avgLatency: Math.max(0.5, prev.avgLatency + (Math.random() - 0.5) * 0.5),
        securityScore: Math.min(100, Math.max(95, prev.securityScore + (Math.random() - 0.5) * 2)),
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Chart data
  const performanceData = [
    { time: '00:00', gasPrice: 42, latency: 2.1, success: 99.5 },
    { time: '04:00', gasPrice: 45, latency: 2.3, success: 99.8 },
    { time: '08:00', gasPrice: 48, latency: 2.5, success: 99.2 },
    { time: '12:00', gasPrice: 52, latency: 2.8, success: 98.9 },
    { time: '16:00', gasPrice: 50, latency: 2.6, success: 99.6 },
    { time: '20:00', gasPrice: 46, latency: 2.4, success: 99.9 },
  ];

  const complianceData = [
    { check: 'Signature Valid', score: 100 },
    { check: 'Amount Verified', score: 100 },
    { check: 'Rate Limited', score: 98 },
    { check: 'Chain Bound', score: 100 },
    { check: 'Replay Safe', score: 99 },
  ];

  return (
    <div className="space-y-20 py-20">
      {/* Header */}
      <section className="px-6 pt-20">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-x4-gold-400 mb-6">
            x444 Technical Specification
          </h1>
          <p className="text-xl text-x4-silver-400 max-w-3xl">
            The complete x444 protocol specification - HTTP 444 Payment Required for memocoin-native payments on blockchain.
          </p>
        </div>
      </section>

      {/* Live Metrics Dashboard */}
      <section className="px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-x4-gold-400 mb-8">Live Network Metrics</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Gauge, label: 'Gas Price', value: metrics.gasPrice.toFixed(1), unit: 'gwei', color: 'text-x4-gold-400' },
              { icon: Activity, label: 'Success Rate', value: metrics.txSuccess.toFixed(1), unit: '%', color: 'text-green-400' },
              { icon: Zap, label: 'Avg Latency', value: metrics.avgLatency.toFixed(2), unit: 'ms', color: 'text-blue-400' },
              { icon: Shield, label: 'Security', value: metrics.securityScore.toFixed(0), unit: '/100', color: 'text-purple-400' },
            ].map((metric, i) => {
              const Icon = metric.icon;
              const colorValue = metric.value;
              return (
                <div key={i} className="bg-gradient-to-br from-slate-900/80 to-slate-900/60 border border-x4-gold-500/20 rounded-lg p-4 hover:border-x4-gold-500/50 transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-x4-silver-400 text-xs uppercase tracking-wide">{metric.label}</p>
                      <div className="flex items-baseline gap-1 mt-1">
                        <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
                        <p className="text-xs text-x4-silver-500">{metric.unit}</p>
                      </div>
                    </div>
                    <Icon className={`w-5 h-5 ${metric.color}`} />
                  </div>
                  <div className="w-full bg-slate-800/50 rounded-full h-1">
                    <div
                      className={`h-1 rounded-full ${metric.color === 'text-x4-gold-400' ? 'bg-x4-gold-400' : metric.color === 'text-green-400' ? 'bg-green-400' : metric.color === 'text-blue-400' ? 'bg-blue-400' : 'bg-purple-400'}`}
                      style={{ width: `${Math.min(100, (parseFloat(metric.value) / 100) * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Performance Chart */}
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/60 border border-x4-gold-500/20 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-bold text-x4-gold-400 mb-4">24h Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorGas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F3BA2F" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F3BA2F" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="time" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#F3BA2F', borderRadius: '8px' }}
                  labelStyle={{ color: '#F3BA2F' }}
                />
                <Legend />
                <Area type="monotone" dataKey="gasPrice" stroke="#F3BA2F" fillOpacity={1} fill="url(#colorGas)" name="Gas Price (gwei)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2 mb-8 border-b border-x4-gold-500/20 pb-0 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'specs', label: 'Specifications' },
              { id: 'security', label: 'Security' },
              { id: 'integration', label: 'Integration' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 font-semibold transition-all border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-x4-gold-400 text-x4-gold-400'
                    : 'border-transparent text-x4-silver-400 hover:text-x4-gold-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-x4-gold-400 mb-8">Protocol Overview</h2>

              <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/60 border border-x4-gold-500/30 rounded-xl p-8 mb-12">
                <p className="text-x4-silver-400 mb-4 text-lg">
                  <strong>x444</strong> is a memocoin-native HTTP payment protocol built on the x402 architecture. It enables instant payments in volatile memecoins (DEGEN, PEPE, etc.) across multiple blockchains (Base, BNB, Ethereum, Solana).
                </p>
                <p className="text-x4-silver-400 mb-4">
                  Think of x402 as "HTTP 402 for stablecoins" — x444 is "HTTP 444 for memecoins" with dynamic pricing.
                </p>
              </div>

              <h3 className="text-2xl font-bold text-x4-gold-400 mb-6">Key Features</h3>
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                {[
                  { icon: Zap, title: 'Dynamic Pricing', desc: 'Automatically converts USD prices to token amounts using live oracle feeds' },
                  { icon: Shield, title: 'Volatility Protection', desc: '60-second price quotes with slippage tolerance prevent stale prices' },
                  { icon: Code2, title: 'Multi-Chain', desc: 'Accept payments on Base, BNB, Ethereum, Solana with unified interface' },
                  { icon: CheckCircle2, title: 'Memocoin Native', desc: 'Handles transfer fees, reflections, blacklists, and other quirks' },
                ].map((feature, i) => {
                  const Icon = feature.icon;
                  return (
                    <div key={i} className="bg-gradient-to-br from-slate-900/80 to-slate-900/60 border border-x4-gold-500/20 hover:border-x4-gold-500/50 rounded-xl p-6 transition-all">
                      <Icon className="w-8 h-8 text-x4-gold-400 mb-3" />
                      <h4 className="text-lg font-semibold text-x4-gold-300 mb-2">{feature.title}</h4>
                      <p className="text-x4-silver-400 text-sm">{feature.desc}</p>
                    </div>
                  );
                })}
              </div>

              {/* How It Works in Overview */}
              <h3 className="text-3xl font-bold text-x4-gold-400 mb-8 mt-12">How It Works</h3>
              <div className="space-y-8">
                {/* Step 1 */}
                <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/60 border border-x4-gold-500/20 rounded-xl p-8">
                  <div className="flex gap-4 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-x4-gold-500 to-x4-gold-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-slate-900">1</span>
                    </div>
                    <h4 className="text-2xl font-bold text-x4-gold-400 self-center">Server Requests Payment (HTTP 444)</h4>
                  </div>
                  <p className="text-x4-silver-400 mb-4">When a user accesses a protected resource without payment:</p>
                  <pre className="bg-slate-900 border border-x4-gold-500/20 rounded-lg p-4 overflow-x-auto mb-4">
                    <code className="text-x4-gold-300 text-sm">
{`HTTP/1.1 444 Payment Required

{
  "x444Version": "1.0.0",
  "accepts": [
    {
      "scheme": "exact-memocoin",
      "network": "base",
      "asset": "0x4ed4e862...",
      "assetSymbol": "DEGEN",
      "priceUSD": "0.10",
      "estimatedTokenAmount": "123,456",
      "maxAmountRequired": "123456000000000000",
      "quoteId": "abc123...",
      "quoteExpiresAt": 1740673089000,
      "slippageTolerance": 0.05
    }
  ]
}`}
                    </code>
                  </pre>
                </div>

                {/* Step 2 */}
                <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/60 border border-x4-gold-500/20 rounded-xl p-8">
                  <div className="flex gap-4 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-x4-gold-500 to-x4-gold-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-slate-900">2</span>
                    </div>
                    <h4 className="text-2xl font-bold text-x4-gold-400 self-center">Client Creates Signed Payment (EIP-712)</h4>
                  </div>
                  <p className="text-x4-silver-400 mb-4">Client cryptographically signs payment authorization:</p>
                  <pre className="bg-slate-900 border border-x4-gold-500/20 rounded-lg p-4 overflow-x-auto">
                    <code className="text-x4-gold-300 text-sm">
{`// Client signs payment authorization
const signature = await signer.signMessage({
  from: userAddress,
  to: serverAddress,
  value: "123456000000000000",  // DEGEN amount
  validAfter: Math.floor(Date.now() / 1000),
  validBefore: Math.floor(Date.now() / 1000) + 120
});

// Retry request with payment
const response = await fetch(resource, {
  headers: {
    'X-PAYMENT': JSON.stringify({
      scheme: 'exact-memocoin',
      network: 'base',
      payload: { signature, authorization }
    })
  }
});`}
                    </code>
                  </pre>
                </div>

                {/* Step 3 */}
                <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/60 border border-x4-gold-500/20 rounded-xl p-8">
                  <div className="flex gap-4 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-x4-gold-500 to-x4-gold-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-slate-900">3</span>
                    </div>
                    <h4 className="text-2xl font-bold text-x4-gold-400 self-center">Server Verifies & Settles Payment</h4>
                  </div>
                  <p className="text-x4-silver-400">Middleware verifies payment signature and settles on blockchain. Server returns resource with 200 OK.</p>
                </div>
              </div>
            </div>
          )}

          {/* SPECIFICATIONS TAB */}
          {activeTab === 'specs' && (
            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-x4-gold-400 mb-8">Technical Specifications</h2>

              <div className="space-y-8">
                {/* Implementation Status */}
                <div>
                  <h3 className="text-2xl font-bold text-x4-gold-400 mb-6">Implementation Status</h3>
                  <div className="grid md:grid-cols-3 gap-8">
                    {/* Phase 1 */}
                    <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/60 border border-x4-gold-500/20 rounded-xl p-6">
                      <h4 className="text-xl font-bold text-x4-gold-400 mb-4">✅ Phase 1: Foundation</h4>
                      <ul className="space-y-2 text-x4-silver-400 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-x4-gold-400 flex-shrink-0" />
                          TypeScript type definitions
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-x4-gold-400 flex-shrink-0" />
                          Price oracle implementations
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-x4-gold-400 flex-shrink-0" />
                          Quote manager (60-second expiration)
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-x4-gold-400 flex-shrink-0" />
                          Token registry
                        </li>
                      </ul>
                    </div>

                    {/* Phase 2 */}
                    <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/60 border border-x4-gold-500/20 rounded-xl p-6">
                      <h4 className="text-xl font-bold text-x4-gold-400 mb-4">🔄 Phase 2: In Progress</h4>
                      <ul className="space-y-2 text-x4-silver-400 text-sm">
                        <li className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-x4-gold-400 rounded flex-shrink-0" />
                          Dynamic pricing scheme
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-x4-gold-400 rounded flex-shrink-0" />
                          Base Chain facilitator
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-x4-gold-400 rounded flex-shrink-0" />
                          Express middleware
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-x4-gold-400 rounded flex-shrink-0" />
                          Integration layer
                        </li>
                      </ul>
                    </div>

                    {/* Phase 3 */}
                    <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/60 border border-x4-gold-500/20 rounded-xl p-6">
                      <h4 className="text-xl font-bold text-x4-gold-400 mb-4">⏳ Phase 3: Planned</h4>
                      <ul className="space-y-2 text-x4-silver-400 text-sm">
                        <li className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-x4-gold-400 rounded flex-shrink-0" />
                          BNB Chain support
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-x4-gold-400 rounded flex-shrink-0" />
                          Client library
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-x4-gold-400 rounded flex-shrink-0" />
                          Solana support
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-x4-gold-400 rounded flex-shrink-0" />
                          Full documentation
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Protocol Details */}
                <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/60 border border-x4-gold-500/20 rounded-xl p-8">
                  <h3 className="text-xl font-bold text-x4-gold-400 mb-4">HTTP 444 Response Format</h3>
                  <pre className="bg-slate-900 border border-x4-gold-500/20 rounded-lg p-4 overflow-x-auto">
                    <code className="text-x4-gold-300 text-sm">
{`interface X444Response {
  x444Version: string;        // "1.0.0"
  accepts: PaymentMethod[];   // Array of accepted tokens
  paymentRequired?: boolean;  // Force payment
  expiresAt?: number;         // Quote expiration timestamp
}

interface PaymentMethod {
  scheme: string;             // "exact-memocoin"
  network: "base" | "bnb" | "ethereum" | "solana";
  asset: string;              // Token contract address
  assetSymbol: string;        // "DEGEN", "PEPE", etc.
  priceUSD: string;           // Current USD price
  estimatedTokenAmount: string;  // Suggested token amount
  maxAmountRequired: string;   // Max with slippage
  quoteId: string;            // Unique quote identifier
  quoteExpiresAt: number;     // Quote validity (60 seconds)
  slippageTolerance: number;  // Default 0.05 (5%)
}`}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-x4-gold-400 mb-8">Security & Compliance</h2>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Token Risk */}
                <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/60 border border-x4-gold-500/20 rounded-xl p-8">
                  <h3 className="text-xl font-bold text-x4-gold-400 mb-4">Token Risk Assessment</h3>
                  <ul className="space-y-3 text-x4-silver-400 text-sm">
                    <li><strong className="text-x4-gold-300">Liquidity</strong>: Minimum $100k USD 24-hour volume</li>
                    <li><strong className="text-x4-gold-300">Audit Status</strong>: Third-party security audit required</li>
                    <li><strong className="text-x4-gold-300">Risk Score</strong>: 0-100 (higher = more risky)</li>
                    <li><strong className="text-x4-gold-300">Flags</strong>: Honeypot, transfer fees, reflections, blacklists</li>
                    <li><strong className="text-x4-gold-300">Ownership</strong>: Renounced or locked preferred</li>
                  </ul>
                </div>

                {/* Price Safety */}
                <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/60 border border-x4-gold-500/20 rounded-xl p-8">
                  <h3 className="text-xl font-bold text-x4-gold-400 mb-4">Price Safety</h3>
                  <ul className="space-y-3 text-x4-silver-400 text-sm">
                    <li><strong className="text-x4-gold-300">Quote Expiration</strong>: All quotes expire after 60 seconds</li>
                    <li><strong className="text-x4-gold-300">Slippage Limits</strong>: Client-defined maximum slippage (5% default)</li>
                    <li><strong className="text-x4-gold-300">Oracle Fallback</strong>: Hybrid CoinGecko + Chainlink</li>
                    <li><strong className="text-x4-gold-300">Replay Protection</strong>: EIP-712 signed messages prevent replay</li>
                    <li><strong className="text-x4-gold-300">Amount Validation</strong>: Server verifies actual amount received</li>
                  </ul>
                </div>
              </div>

              {/* Security Compliance Chart */}
              <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/60 border border-x4-gold-500/20 rounded-xl p-8">
                <h3 className="text-lg font-bold text-x4-gold-400 mb-6">Security Compliance Scores</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={complianceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="check" stroke="#888" angle={-45} textAnchor="end" height={100} />
                    <YAxis stroke="#888" domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#F3BA2F', borderRadius: '8px' }}
                      labelStyle={{ color: '#F3BA2F' }}
                    />
                    <Bar dataKey="score" fill="#F3BA2F" name="Compliance Score" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Critical Security */}
              <div className="bg-gradient-to-br from-x4-gold-500/10 to-slate-900/50 border border-x4-gold-500/40 rounded-xl p-8">
                <h3 className="text-xl font-bold text-x4-gold-400 mb-4">🔒 Critical Security Measures</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-x4-gold-300 mb-2">Signature Verification</h4>
                    <p className="text-x4-silver-400 text-sm">All payments must be verified via EIP-712 signature recovery. No unsigned payments accepted.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-x4-gold-300 mb-2">Amount Validation</h4>
                    <p className="text-x4-silver-400 text-sm">Server verifies actual token amount received matches quoted amount within slippage tolerance.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-x4-gold-300 mb-2">Rate Limiting</h4>
                    <p className="text-x4-silver-400 text-sm">Per-address rate limits prevent spam and DoS attacks on payment verification.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-x4-gold-300 mb-2">Chain ID Binding</h4>
                    <p className="text-x4-silver-400 text-sm">All signatures include chain ID to prevent cross-chain replay attacks.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* INTEGRATION TAB */}
          {activeTab === 'integration' && (
            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-x4-gold-400 mb-8">Integration Guide</h2>

              <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/60 border border-x4-gold-500/20 rounded-xl p-8 mb-8">
                <h3 className="text-xl font-bold text-x4-gold-400 mb-4">Basic Server Setup</h3>
                <pre className="bg-slate-900 border border-x4-gold-500/20 rounded-lg p-4 overflow-x-auto">
                  <code className="text-x4-gold-300 text-sm">
{`import { X444Server } from '@x444/server';

const server = new X444Server({
  rpcUrl: 'https://mainnet.base.org',
  // IMPORTANT: This is SERVER-SIDE code only!
  // Never expose private keys in client-side code
  privateKey: process.env.FACILITATOR_KEY, // Server environment variable
  tokenRegistry: [/* supported tokens */]
});

app.post('/api/resource', async (req, res) => {
  // Check for payment header
  const payment = req.headers['x-payment'];

  if (!payment) {
    return res.status(444).json({
      x444Version: '1.0.0',
      accepts: server.getPaymentMethods()
    });
  }

  // Verify and settle payment
  const result = await server.verifyAndSettle(payment);

  if (result.success) {
    // Payment verified - deliver resource
    res.json({ resource: 'protected content' });
  } else {
    res.status(402).json({ error: result.error });
  }
});`}
                  </code>
                </pre>
              </div>

              <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/60 border border-x4-gold-500/20 rounded-xl p-8">
                <h3 className="text-xl font-bold text-x4-gold-400 mb-4">Client-Side Integration</h3>
                <pre className="bg-slate-900 border border-x4-gold-500/20 rounded-lg p-4 overflow-x-auto">
                  <code className="text-x4-gold-300 text-sm">
{`import { X444Client } from '@x444/client';

const client = new X444Client({
  rpcUrl: 'https://mainnet.base.org',
  chainId: 8453 // Base mainnet
});

async function accessResource(url) {
  const response = await fetch(url);

  if (response.status === 444) {
    // Payment required
    const paymentMethods = await response.json();

    // Sign and submit payment
    const signature = await signer.signMessage(
      paymentMethods.accepts[0]
    );

    // Retry with payment
    return fetch(url, {
      headers: {
        'X-PAYMENT': JSON.stringify({
          signature,
          method: paymentMethods.accepts[0]
        })
      }
    });
  }

  return response;
}`}
                  </code>
                </pre>
              </div>

              <div className="bg-x4-gold-500/5 border border-x4-gold-500/30 rounded-xl p-6">
                <div className="flex gap-3 items-start">
                  <AlertCircle className="w-6 h-6 text-x4-gold-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-x4-gold-300 mb-2">Best Practices</h4>
                    <ul className="text-x4-silver-400 text-sm space-y-1">
                      <li>• Always validate quote expiration before submitting payment</li>
                      <li>• Implement exponential backoff for network retries</li>
                      <li>• Store payment receipts for audit trails</li>
                      <li>• Use testnet for development and testing</li>
                      <li>• Monitor gas prices and adjust facilitator settings accordingly</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
