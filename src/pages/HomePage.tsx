import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Globe, Lock, Gauge, Layers, Code, TrendingUp, Award, Users, Bolt, Coins } from 'lucide-react';
import GrowthChart from '../components/GrowthChart';
import AdoptionMetrics from '../components/AdoptionMetrics';
import Roadmap from '../components/Roadmap';

const features = [
  { icon: Zap, title: 'BNB Chain + Solana', desc: 'Multi-chain support for memecoins on the fastest, cheapest networks' },
  { icon: Coins, title: 'Accept Any Memecoin', desc: 'DEGEN, PEPE, SHIB, BONK, WIF - pay creators in the tokens fans love' },
  { icon: Lock, title: 'Zero Fan Gas Fees', desc: 'Gasless payments - fans sign, you relay (~$0.0001 on Solana!)' },
  { icon: Gauge, title: 'Real-Time Pricing', desc: 'Oracle-based pricing with slippage protection for volatile assets' },
  { icon: Layers, title: 'Instant Settlement', desc: 'Non-custodial - funds hit your wallet in <1 second' },
  { icon: Code, title: 'Widget for Creators', desc: 'Embeddable payment widget - no coding required for content creators' },
];

export default function HomePage() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const [showVideo, setShowVideo] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  // Detect desktop vs mobile
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lazy load video with Intersection Observer
  useEffect(() => {
    if (!isDesktop) return; // Don't load on mobile

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowVideo(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (videoContainerRef.current) {
      observer.observe(videoContainerRef.current);
    }

    return () => {
      if (videoContainerRef.current) {
        observer.unobserve(videoContainerRef.current);
      }
    };
  }, [isDesktop]);

  return (
    <div className="space-y-32 py-20">
      {/* Hero Section with Video Background */}
      <section className="px-6 pt-20 relative" ref={videoContainerRef}>
        {/* Video Background - Desktop Only with Lazy Loading */}
        {isDesktop && showVideo && (
          <div className="absolute inset-0 opacity-40 rounded-3xl overflow-hidden will-change-transform">
            <video
              autoPlay
              muted
              loop
              playsInline
              poster="/x4-ghost.png"
              preload="metadata"
              className="w-full h-full object-cover"
            >
              <source src="/12421540_1920_1080_30fps.mp4" type="video/mp4" />
            </video>
          </div>
        )}

        {/* Fallback Background Image - Mobile or when video not loaded */}
        {!isDesktop || !showVideo ? (
          <div className="absolute inset-0 opacity-40 rounded-3xl overflow-hidden">
            <img
              src="/x4-ghost.png"
              alt="x4 Ghost Banner"
              className="w-full h-full object-cover"
            />
          </div>
        ) : null}

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="mb-8 flex justify-center">
            <img
              src="/x4-logo.jpg"
              alt="x4 Logo Banner"
              className="h-32 md:h-48 object-contain drop-shadow-lg hover:scale-105 transition-transform"
            />
          </div>

          <h1 className="text-7xl md:text-8xl font-bold text-x4-gold-400 mb-6 leading-tight drop-shadow-lg">
            x4
          </h1>

          <p className="text-2xl text-x4-silver-300 max-w-2xl mx-auto mb-4 drop-shadow-md font-semibold">
            The Utility Token for Memecoins & Stablecoins
          </p>

          <p className="text-lg text-x4-silver-400 max-w-3xl mx-auto mb-12 drop-shadow-md">
            The HTTP 402 Payment Protocol reimagined for volatile assets. Accept any BEP-20 token with instant, gasless payments on BSC.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/protocol" className="btn btn-primary group">
              Explore Protocol
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
            <Link to="/token" className="btn btn-secondary">
              x4 Token (Dec 2025)
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-20 border-t border-x4-gold-500/20">
            {[
              { value: '5+', label: 'Networks' },
              { value: '<1s', label: 'Settlement' },
              { value: '$0', label: 'Gas Fees' },
              { value: 'Open', label: 'Source' },
            ].map((stat, i) => (
              <div key={i} className="group">
                <div className="text-4xl font-bold text-x4-gold-400 mb-2 group-hover:scale-110 transition-transform">
                  {stat.value}
                </div>
                <div className="text-x4-silver-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-x4-gold-400 mb-12 text-center">Powerful Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="group p-8 bg-gradient-to-br from-slate-900/80 to-slate-900/60 border border-x4-gold-500/20 hover:border-x4-gold-500/50 rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-x4-gold-500/20"
                >
                  <Icon className="w-8 h-8 text-x4-gold-500 mb-4 group-hover:scale-125 transition-transform" />
                  <h3 className="text-lg font-semibold text-x4-gold-300 mb-2">{feature.title}</h3>
                  <p className="text-x4-silver-400 text-sm">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* x4 Token Utility Section */}
      <section className="px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-x4-gold-400 mb-12 text-center">x4 Token: Protocol Utility</h2>
          <p className="text-center text-x4-silver-400 mb-12 max-w-2xl mx-auto">
            x4 is the utility token that powers the x444 protocol. Hold it to unlock fee discounts, earn staking rewards, and vote on protocol decisions.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { Icon: TrendingUp, title: 'Fee Discounts', desc: 'Hold x4 tokens and save 10-75% on x444 payment fees' },
              { Icon: Award, title: 'Staking Rewards', desc: 'Earn 10-25% APY by locking x4 for 30-365 days' },
              { Icon: Users, title: 'Governance', desc: 'Vote on protocol fees, token whitelist, and upgrades' },
            ].map((item, i) => (
              <div
                key={i}
                className="p-6 bg-gradient-to-br from-slate-900/80 to-slate-900/60 border border-x4-gold-500/20 hover:border-x4-gold-500/50 rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-x4-gold-500/20"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-x4-gold-500/30 rounded-lg flex items-center justify-center border border-x4-gold-500/40">
                    <item.Icon className="w-6 h-6 text-x4-gold-400" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-x4-gold-300 mb-2 text-center">{item.title}</h3>
                <p className="text-x4-silver-400 text-sm text-center">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI-Coordinated Governance Section */}
      <section className="px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-x4-gold-400 mb-12 text-center">AI-Coordinated Governance</h2>
          <p className="text-center text-x4-silver-400 mb-12 max-w-3xl mx-auto">
            x4 governance combines human decision-making with AI agents that analyze data, propose improvements, and coordinate on protocol evolution. Your vote matters. AI helps it scale.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Governance Mechanics */}
            <div className="p-8 bg-gradient-to-br from-slate-900/80 to-slate-900/60 border border-x4-gold-500/20 rounded-xl hover:border-x4-gold-500/50 transition-all">
              <h3 className="text-2xl font-bold text-x4-gold-400 mb-6">How It Works</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-x4-gold-500/20 border border-x4-gold-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-x4-gold-300">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-x4-gold-300 mb-1">AI Agents Propose</h4>
                    <p className="text-sm text-x4-silver-400">8 specialized agents analyze market data, protocol metrics, and community sentiment to propose improvements</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-x4-gold-500/20 border border-x4-gold-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-x4-gold-300">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-x4-gold-300 mb-1">x4 Holders Vote</h4>
                    <p className="text-sm text-x4-silver-400">Token holders vote on agent proposals. Your stake = your voting power on protocol decisions</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-x4-gold-500/20 border border-x4-gold-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-x4-gold-300">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-x4-gold-300 mb-1">Agents Coordinate</h4>
                    <p className="text-sm text-x4-silver-400">Approved proposals executed by agents. They coordinate implementation and report back to community</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Agent Specializations */}
            <div className="p-8 bg-gradient-to-br from-slate-900/80 to-slate-900/60 border border-x4-gold-500/20 rounded-xl hover:border-x4-gold-500/50 transition-all">
              <h3 className="text-2xl font-bold text-x4-gold-400 mb-6">Governance Agents</h3>
              <div className="space-y-3">
                <div className="p-3 bg-slate-900/50 rounded-lg border border-x4-gold-500/20 hover:border-x4-gold-500/40 transition-colors">
                  <p className="text-sm font-semibold text-x4-gold-400">Financial Strategist</p>
                  <p className="text-xs text-x4-silver-400">Fee optimization, treasury management, economic incentives</p>
                </div>
                <div className="p-3 bg-slate-900/50 rounded-lg border border-x4-gold-500/20 hover:border-x4-gold-500/40 transition-colors">
                  <p className="text-sm font-semibold text-x4-gold-400">Market Maven</p>
                  <p className="text-xs text-x4-silver-400">Memecoin trends, volume analysis, adoption metrics</p>
                </div>
                <div className="p-3 bg-slate-900/50 rounded-lg border border-x4-gold-500/20 hover:border-x4-gold-500/40 transition-colors">
                  <p className="text-sm font-semibold text-x4-gold-400">Tech Wizard</p>
                  <p className="text-xs text-x4-silver-400">Protocol upgrades, smart contract security, infrastructure</p>
                </div>
                <div className="p-3 bg-slate-900/50 rounded-lg border border-x4-gold-500/20 hover:border-x4-gold-500/40 transition-colors">
                  <p className="text-sm font-semibold text-x4-gold-400">Regulatory Ranger</p>
                  <p className="text-xs text-x4-silver-400">Compliance monitoring, jurisdictional awareness, policy alignment</p>
                </div>
                <div className="p-3 bg-slate-900/50 rounded-lg border border-x4-gold-500/20 hover:border-x4-gold-500/40 transition-colors">
                  <p className="text-sm font-semibold text-x4-gold-400">+ 3 More Specialists</p>
                  <p className="text-xs text-x4-silver-400">Community, security, ecosystem coordination</p>
                </div>
              </div>
            </div>
          </div>

          {/* Coming Soon Badge */}
          <div className="text-center p-8 bg-gradient-to-br from-x4-gold-500/10 to-yellow-600/10 border border-x4-gold-500/20 rounded-xl">
            <div className="inline-block px-4 py-2 bg-x4-gold-500/20 border border-x4-gold-500/40 rounded-full mb-4">
              <span className="text-sm font-semibold text-x4-gold-300">Q4 2025</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Governance Smart Contract Deployment</h3>
            <p className="text-slate-300 max-w-2xl mx-auto">
              The governance smart contract is in final validation. Once deployed, AI agents will begin coordinating protocol decisions with x4 token holders voting on major changes.
            </p>
          </div>
        </div>
      </section>

      {/* x402 vs x444 Comparison */}
      <section className="px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">Why x444 Over x402</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* x402 Card */}
            <div className="p-8 bg-gradient-to-br from-blue-900/30 to-blue-800/30 border border-x4-gold-500/20 rounded-xl">
              <div className="flex items-center gap-3 mb-6">
                <Coins className="w-6 h-6 text-x4-gold-400" />
                <h3 className="text-2xl font-bold text-x4-gold-400">x402 Standard</h3>
              </div>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  Limited to stablecoins only
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  Fixed pricing (no oracle)
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  No volatile asset support
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  Enterprise focus
                </li>
              </ul>
            </div>

            {/* x444 Card */}
            <div className="p-8 bg-gradient-to-br from-yellow-900/30 to-orange-800/30 border border-yellow-500/20 rounded-xl">
              <div className="flex items-center gap-3 mb-6">
                <Bolt className="w-6 h-6 text-yellow-400" />
                <h3 className="text-2xl font-bold text-yellow-400">x444 Protocol</h3>
              </div>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                  Accepts any BEP-20 token (stablecoins + memecoins)
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                  Oracle-adjusted dynamic pricing
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                  Built for volatile assets (memecoins, etc)
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                  Gasless for users, merchant-paid settlement
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* x444 vs x402b (Pieverse) Comparison */}
      <section className="px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">x444 vs x402b (Competing Solutions)</h2>
          <p className="text-center text-slate-300 mb-12 max-w-3xl mx-auto">
            Both x444 and x402b operate on BNB Chain, but they approach the HTTP 402 payment problem differently.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {/* x402b Card */}
            <div className="p-8 bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700/50 rounded-xl">
              <div className="flex items-center gap-3 mb-6">
                <Coins className="w-6 h-6 text-slate-400" />
                <h3 className="text-2xl font-bold text-slate-300">x402b (Pieverse)</h3>
              </div>
              <ul className="space-y-3 text-slate-400">
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                  Stablecoins only (pieUSD wrapper)
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                  Fixed pricing (no oracle)
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                  Enterprise compliance focus (receipts, audit)
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                  Gasless (EIP-3009 via Pieverse facilitator)
                </li>
              </ul>
            </div>

            {/* x444 Card */}
            <div className="p-8 bg-gradient-to-br from-x4-gold-500/10 to-yellow-600/10 border border-x4-gold-500/30 rounded-xl">
              <div className="flex items-center gap-3 mb-6">
                <Bolt className="w-6 h-6 text-x4-gold-400" />
                <h3 className="text-2xl font-bold text-x4-gold-300">x444 (Ours)</h3>
              </div>
              <ul className="space-y-3 text-slate-200">
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-x4-gold-400"></span>
                  Any BEP-20 token (memecoins, volatile assets)
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-x4-gold-400"></span>
                  Oracle-based dynamic pricing (not fixed)
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-x4-gold-400"></span>
                  Gasless (EIP-3009 via x444 facilitator)
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-x4-gold-400"></span>
                  Retail-first for memecoin economy
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How x444 Works - Technical Deep Dive */}
      <section className="px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">How x444 Works</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Oracle Pricing */}
            <div className="p-8 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-slate-700/50 rounded-xl">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-x4-gold-300 mb-3">1. Oracle Pricing</h3>
                <p className="text-slate-300 text-sm mb-3">
                  Real-time token prices from CoinGecko oracle with Chainlink fallback
                </p>
                <ul className="space-y-2 text-xs text-slate-400">
                  <li>✓ 60-second time-bound quotes</li>
                  <li>✓ 5% slippage tolerance</li>
                  <li>✓ Handles memecoin volatility</li>
                  <li>✓ Sandwich attack prevention</li>
                </ul>
              </div>
            </div>

            {/* EIP-3009 Gasless */}
            <div className="p-8 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-slate-700/50 rounded-xl">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-x4-gold-300 mb-3">2. EIP-3009 Gasless</h3>
                <p className="text-slate-300 text-sm mb-3">
                  User signs with EIP-712, facilitator pays gas
                </p>
                <ul className="space-y-2 text-xs text-slate-400">
                  <li>✓ User signs (no gas)</li>
                  <li>✓ Off-chain relay</li>
                  <li>✓ Facilitator submits tx (~$0.20)</li>
                  <li>✓ Non-custodial transfer</li>
                </ul>
              </div>
            </div>

            {/* Settlement */}
            <div className="p-8 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-slate-700/50 rounded-xl">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-x4-gold-300 mb-3">3. Instant Settlement</h3>
                <p className="text-slate-300 text-sm mb-3">
                  Direct token transfer with 1-block confirmation
                </p>
                <ul className="space-y-2 text-xs text-slate-400">
                  <li>✓ &lt;1 second settlement</li>
                  <li>✓ Merchants control funds</li>
                  <li>✓ Non-custodial design</li>
                  <li>✓ Works with any BEP-20</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Flow Diagram Section */}
          <div className="p-8 bg-gradient-to-br from-slate-900/30 to-slate-800/30 border border-slate-700/50 rounded-xl">
            <h3 className="text-2xl font-bold text-white mb-6">Complete Flow: From Quote to Settlement</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-x4-gold-500/20 border border-x4-gold-500/40 flex-shrink-0">
                  <span className="text-sm font-bold text-x4-gold-300">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Customer Initiates Payment</h4>
                  <p className="text-slate-400 text-sm">Customer selects token (e.g., DOGE, SHIB, USDC) and amount at your checkout</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-x4-gold-500/20 border border-x4-gold-500/40 flex-shrink-0">
                  <span className="text-sm font-bold text-x4-gold-300">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Get Real-Time Quote</h4>
                  <p className="text-slate-400 text-sm">x444 oracle fetches live token price from CoinGecko (with Chainlink fallback). Quote valid for 60 seconds.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-x4-gold-500/20 border border-x4-gold-500/40 flex-shrink-0">
                  <span className="text-sm font-bold text-x4-gold-300">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Customer Signs (EIP-712)</h4>
                  <p className="text-slate-400 text-sm">Customer cryptographically signs authorization in their wallet. No gas fee. Non-custodial.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-x4-gold-500/20 border border-x4-gold-500/40 flex-shrink-0">
                  <span className="text-sm font-bold text-x4-gold-300">4</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Submit to Facilitator (Off-chain)</h4>
                  <p className="text-slate-400 text-sm">Signed authorization relayed to x444 payment facilitator via secure off-chain relay</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-x4-gold-500/20 border border-x4-gold-500/40 flex-shrink-0">
                  <span className="text-sm font-bold text-x4-gold-300">5</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Execute On-Chain</h4>
                  <p className="text-slate-400 text-sm">Facilitator calls <code className="text-amber-300 bg-slate-800/50 px-2 py-1 rounded text-xs inline">transferWithAuthorization()</code> contract function. Facilitator pays ~$0.20 gas on BSC.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-x4-gold-500/20 border border-x4-gold-500/40 flex-shrink-0">
                  <span className="text-sm font-bold text-x4-gold-300">6</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Instant Settlement</h4>
                  <p className="text-slate-400 text-sm">Tokens transferred directly to your wallet in &lt;1 second. 1-block confirmation. You own the funds immediately.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Growth & Adoption Section */}
      <section className="px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">Growth & Adoption</h2>
          <GrowthChart />
        </div>
      </section>

      {/* Live Metrics Section */}
      <section className="px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-8 text-center">Real-Time Metrics</h2>
          <AdoptionMetrics />
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="px-6">
        <div className="max-w-6xl mx-auto">
          <Roadmap />
        </div>
      </section>

      {/* x4 Token Promo Section */}
      <section className="px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-orange-600/20 via-yellow-600/20 to-orange-600/20 border border-orange-500/40 rounded-2xl p-12">
          <div className="text-center mb-8">
            <div className="inline-block px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-full mb-4">
              <span className="text-sm font-medium bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                Coming December 2025
              </span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">x4 Protocol Token Launch</h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Get early access to x4 - the utility token powering x444. Earn 10-25% APY staking rewards, get 10-75% payment fee discounts, and vote on protocol governance.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              { Icon: TrendingUp, label: 'Staking Rewards', desc: '10-25% APY from protocol fees' },
              { Icon: Zap, label: 'Fee Discounts', desc: 'Up to 75% off payment gas' },
              { Icon: Users, label: 'Governance', desc: 'Vote on protocol decisions' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <item.Icon className="w-6 h-6 text-orange-400" />
                  </div>
                </div>
                <div className="font-semibold text-white mb-1">{item.label}</div>
                <div className="text-sm text-slate-400">{item.desc}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <Link to="/token" className="btn btn-primary">
              Learn About x4 Token
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-yellow-600/10 via-orange-600/10 to-yellow-600/10 border border-yellow-500/20 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to accept any token?</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Integrate x444 into your application and start accepting any token with instant settlement today.
          </p>
          <Link to="/docs" className="btn btn-primary">
            Get Started with x444
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
