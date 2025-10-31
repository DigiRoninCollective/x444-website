import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Zap, Users, Activity, Gauge } from 'lucide-react';
import { AdvancedMetrics, RealtimeStatus } from '../components/DashboardCharts';

export default function AnalyticsPage() {
  const [stats, setStats] = useState([
    { label: 'Volume', value: 0, target: 1240500000, suffix: '$' },
    { label: 'Users', value: 0, target: 45230, suffix: '' },
    { label: 'Gas Saved', value: 0, target: 78, suffix: '%' },
    { label: 'Transactions', value: 0, target: 2340000, suffix: '' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev =>
        prev.map(stat => ({
          ...stat,
          value: Math.min(stat.value + Math.random() * stat.target * 0.1, stat.target),
        }))
      );
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return Math.floor(num).toString();
  };

  return (
    <div className="space-y-32 py-20">
      {/* Header */}
      <section className="px-6 pt-20">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <RealtimeStatus />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-x4-gold-400 mb-6">
            Network Analytics
          </h1>
          <p className="text-xl text-x4-silver-400">
            Real-time metrics, advanced charts, and cutting-edge insights from the x4 Protocol network. Live data streaming with reactive visualizations.
          </p>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="group p-8 bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700/50 rounded-xl hover:border-x4-gold-500/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-slate-400 text-sm font-medium mb-2">{stat.label}</p>
                    <div className="text-4xl font-bold text-white">
                      {stat.suffix}{formatNumber(stat.value)}
                    </div>
                  </div>
                  <TrendingUp className="w-6 h-6 text-x4-gold-400" />
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-x4-gold-500 to-yellow-400 h-2 rounded-full transition-all duration-100"
                    style={{ width: `${(stat.value / stat.target) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <section className="px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12">Performance Metrics</h2>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Volume Chart */}
            <div className="p-8 bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700/50 rounded-xl">
              <div className="flex items-center gap-3 mb-8">
                <BarChart3 className="w-6 h-6 text-x4-gold-400" />
                <h3 className="text-xl font-bold text-white">Weekly Volume</h3>
              </div>
              <div className="h-64 flex items-end justify-between gap-4 px-2">
                {[2400, 3210, 2290, 2000, 2181, 2500, 2100].map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-gradient-to-t from-x4-gold-500 to-blue-400 rounded-t opacity-70 hover:opacity-100 transition-all"
                      style={{ height: `${(val / 3210) * 100}%` }}
                    />
                    <span className="text-xs text-slate-400">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Network Distribution */}
            <div className="p-8 bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700/50 rounded-xl">
              <div className="flex items-center gap-3 mb-8">
                <Users className="w-6 h-6 text-yellow-400" />
                <h3 className="text-xl font-bold text-white">Network Distribution</h3>
              </div>
              <div className="space-y-6">
                {[
                  { name: 'Ethereum', pct: 45, color: 'from-x4-gold-500 to-blue-600' },
                  { name: 'Polygon', pct: 28, color: 'from-amber-500 to-amber-600' },
                  { name: 'BSC', pct: 18, color: 'from-yellow-500 to-yellow-600' },
                  { name: 'Others', pct: 9, color: 'from-cyan-500 to-yellow-600' },
                ].map((net, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-2">
                      <span className="text-white font-semibold">{net.name}</span>
                      <span className="text-x4-gold-400 font-bold">{net.pct}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${net.color} rounded-full transition-all`}
                        style={{ width: `${net.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transaction Flow */}
      <section className="px-6">
        <div className="max-w-6xl mx-auto">
          <div className="p-8 bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700/50 rounded-xl">
            <div className="flex items-center gap-3 mb-8">
              <Zap className="w-6 h-6 text-yellow-400" />
              <h3 className="text-xl font-bold text-white">Transaction Pipeline (24h)</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: 'Initiated', count: 45230, color: 'from-x4-gold-500 to-blue-600' },
                { label: 'Validated', count: 44980, color: 'from-cyan-500 to-yellow-600' },
                { label: 'Signed', count: 44720, color: 'from-amber-500 to-amber-600' },
                { label: 'Processed', count: 44650, color: 'from-yellow-500 to-yellow-600' },
                { label: 'Settled', count: 44500, color: 'from-green-500 to-green-600' },
              ].map((stage, i) => (
                <div key={i} className="text-center group">
                  <div
                    className={`w-full h-32 bg-gradient-to-b ${stage.color} rounded-lg mb-4 flex items-center justify-center text-white font-bold text-lg opacity-80 group-hover:opacity-100 transition-all`}
                  >
                    {(stage.count / 1000).toFixed(0)}k
                  </div>
                  <p className="text-sm text-slate-400 font-medium">{stage.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg">
              <p className="text-slate-300">
                <span className="text-x4-gold-400 font-bold">Success Rate:</span> 99.87% •
                <span className="text-x4-gold-400 font-bold ml-3">Avg Settlement:</span> 0.43s •
                <span className="text-x4-gold-400 font-bold ml-3">Cost Saved:</span> $2.4M
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
