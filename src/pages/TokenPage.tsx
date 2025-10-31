import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Zap, Lock, Users, Award, DollarSign, Gauge, ShoppingCart, Coins } from 'lucide-react';

export default function TokenPage() {
  return (
    <div className="space-y-32 py-20">
      {/* Hero Section */}
      <section className="px-6 pt-20">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-8 inline-block px-4 py-2 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-full">
            <span className="text-sm font-medium bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
              Launching Soon
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-x4-gold-400 mb-6 leading-tight">
            x4 Protocol Token
            <br />
            Powering Memecoin Payments
          </h1>

          <p className="text-xl text-x4-silver-400 max-w-2xl mx-auto mb-12">
            x4 is the utility token that backs x444. Earn rewards, get fee discounts, vote on protocol decisions, and unlock premium features.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="btn btn-primary group">
              Back to Protocol
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
            <a href="#benefits" className="btn btn-secondary">
              Learn Benefits
            </a>
          </div>
        </div>
      </section>

      {/* Token Stats */}
      <section className="px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-x4-gold-400 mb-12 text-center">Token Fundamentals</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Supply', value: '1,000,000,000' },
              { label: 'Blockchain', value: 'BNB Smart Chain' },
              { label: 'Token Standard', value: 'BEP-20' },
              { label: 'Status', value: 'Ready to Launch' },
            ].map((item, i) => (
              <div key={i} className="p-6 bg-gradient-to-br from-slate-900/80 to-slate-900/60 border border-x4-gold-500/20 rounded-xl text-center hover:border-x4-gold-500/50 transition-colors">
                <div className="text-3xl font-bold text-x4-gold-400 mb-2">{item.value}</div>
                <div className="text-x4-silver-500 text-sm">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-x4-gold-400 mb-12 text-center">Why Hold x4?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Staking */}
            <div className="group p-8 bg-gradient-to-br from-slate-900/80 to-slate-900/60 border border-x4-gold-500/20 hover:border-x4-gold-500/50 rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-x4-gold-500/10">
              <TrendingUp className="w-8 h-8 text-x4-gold-400 mb-4 group-hover:scale-125 transition-transform" />
              <h3 className="text-2xl font-semibold text-x4-gold-300 mb-4">Staking Rewards</h3>
              <p className="text-x4-silver-400 mb-6">Earn 10-25% APY by locking your x4 tokens. Rewards come directly from protocol fees.</p>
              <ul className="space-y-2 text-x4-silver-400 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-x4-gold-400"></span>
                  30-day lock: 10% APY
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-x4-gold-400"></span>
                  90-day lock: 15% APY
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-x4-gold-400"></span>
                  365-day lock: 25% APY
                </li>
              </ul>
            </div>

            {/* Fee Discounts */}
            <div className="group p-8 bg-gradient-to-br from-slate-900/80 to-slate-900/60 border border-x4-gold-500/20 hover:border-x4-gold-500/50 rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-x4-gold-500/10">
              <Zap className="w-8 h-8 text-x4-gold-400 mb-4 group-hover:scale-125 transition-transform" />
              <h3 className="text-2xl font-semibold text-x4-gold-300 mb-4">Payment Discounts</h3>
              <p className="text-x4-silver-400 mb-6">Get up to 75% discount on x444 payment gas fees based on x4 holdings.</p>
              <ul className="space-y-2 text-x4-silver-400 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-x4-gold-400"></span>
                  1K-10K x4: 10% discount
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-x4-gold-400"></span>
                  100K-1M x4: 50% discount
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-x4-gold-400"></span>
                  1M+ x4: 75% discount
                </li>
              </ul>
            </div>

            {/* Governance */}
            <div className="group p-8 bg-gradient-to-br from-slate-900/80 to-slate-900/60 border border-x4-gold-500/20 hover:border-x4-gold-500/50 rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-x4-gold-500/10">
              <Users className="w-8 h-8 text-x4-gold-400 mb-4 group-hover:scale-125 transition-transform" />
              <h3 className="text-2xl font-semibold text-x4-gold-300 mb-4">Governance Rights</h3>
              <p className="text-x4-silver-400 mb-6">Vote on protocol decisions: token whitelist, fee changes, and major upgrades.</p>
              <ul className="space-y-2 text-x4-silver-400 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-x4-gold-400"></span>
                  1 x4 = 1 vote
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-x4-gold-400"></span>
                  7-day voting periods
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-x4-gold-400"></span>
                  Shape protocol direction
                </li>
              </ul>
            </div>

            {/* Premium Features */}
            <div className="group p-8 bg-gradient-to-br from-slate-900/80 to-slate-900/60 border border-x4-gold-500/20 hover:border-x4-gold-500/50 rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-x4-gold-500/10">
              <Award className="w-8 h-8 text-x4-gold-400 mb-4 group-hover:scale-125 transition-transform" />
              <h3 className="text-2xl font-semibold text-x4-gold-300 mb-4">Premium Features</h3>
              <p className="text-x4-silver-400 mb-6">Unlock advanced merchant features and priority settlement.</p>
              <ul className="space-y-2 text-x4-silver-400 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-x4-gold-400"></span>
                  Advanced analytics
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-x4-gold-400"></span>
                  Priority settlement
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-x4-gold-400"></span>
                  Dedicated support
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Distribution */}
      <section className="px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">Token Distribution</h2>
          <div className="p-8 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-slate-700/50 rounded-xl">
            <div className="space-y-6">
              {[
                { name: 'Community & Ecosystem', pct: 40, color: 'from-orange-500' },
                { name: 'Merchant Incentives', pct: 20, color: 'from-yellow-500' },
                { name: 'Team & Operations', pct: 15, color: 'from-amber-500' },
                { name: 'Staking Rewards', pct: 15, color: 'from-orange-400' },
                { name: 'Reserve & Emergency', pct: 10, color: 'from-yellow-600' },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2">
                    <span className="text-white font-semibold">{item.name}</span>
                    <span className="text-orange-400 font-bold">{item.pct}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div
                      className={`bg-gradient-to-r ${item.color} to-orange-300 h-full`}
                      style={{ width: `${item.pct}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Price Projection */}
      <section className="px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">Growth Trajectory</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { period: 'Early Adoption', price: 'Price Discovery', desc: 'Market-driven price at launch' },
              { period: 'Merchant Growth', price: 'Scale Phase', desc: 'Increasing x444 transaction volume' },
              { period: 'Protocol Maturity', price: 'Stability', desc: 'Strong utility-backed value' },
              { period: 'Long Term', price: 'Network Effects', desc: 'Ecosystem expansion and adoption' },
            ].map((item, i) => (
              <div key={i} className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-orange-500/20 rounded-xl">
                <div className="text-orange-400 text-sm font-semibold mb-2">{item.period}</div>
                <div className="text-2xl font-bold text-white mb-2">{item.price}</div>
                <div className="text-slate-400 text-sm">{item.desc}</div>
              </div>
            ))}
          </div>
          <p className="text-slate-300 text-center mt-8 text-sm">
            x4 value is backed by real protocol utility, not speculation. Price follows adoption and transaction volume.
          </p>
        </div>
      </section>

      {/* How to Get */}
      <section className="px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">How to Get x4</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* DEX Launch */}
            <div className="p-8 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-orange-500/50 rounded-xl hover:border-orange-400 transition-colors">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4">
                <Coins className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Buy on DEX</h3>
              <p className="text-x4-silver-400 mb-4">
                Trade x4 tokens on decentralized exchanges. Multiple liquidity pools available across BSC and partner chains.
              </p>
              <a href="#" className="text-orange-400 hover:text-orange-300 text-sm font-semibold">
                View Trading Pairs
              </a>
            </div>

            {/* Staking */}
            <div className="p-8 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-slate-700/50 rounded-xl">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Stake & Earn</h3>
              <p className="text-x4-silver-400 mb-4">
                Lock your x4 tokens and earn 10-25% APY. Rewards come directly from x444 protocol fees.
              </p>
              <a href="#benefits" className="text-orange-400 hover:text-orange-300 text-sm font-semibold">
                Learn About Staking
              </a>
            </div>

            {/* Earn */}
            <div className="p-8 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-slate-700/50 rounded-xl">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Run Facilitator</h3>
              <p className="text-x4-silver-400 mb-4">
                Run a facilitator node and earn 1% of all fees processed. Lock 10M x4 as collateral.
              </p>
              <a href="#docs" className="text-orange-400 hover:text-orange-300 text-sm font-semibold">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-orange-600/10 via-yellow-600/10 to-orange-600/10 border border-orange-500/20 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join the x4 Protocol</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            x4 is launching with complete information available. Get all the details about token economics, staking rewards, governance rights, and facilitator operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="btn btn-primary">
              Explore x444 Protocol
              <ArrowRight className="ml-2" size={20} />
            </Link>
            <a href="#benefits" className="btn btn-secondary">
              Learn More
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
