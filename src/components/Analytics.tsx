import React, { useState, useEffect } from 'react';
import { TrendingUp, Activity, Zap, BarChart3 } from 'lucide-react';

export default function Analytics() {
  const [stats, setStats] = useState([
    { label: 'Total Volume', value: 0, target: 1240500000, suffix: '$' },
    { label: 'Active Users', value: 0, target: 45230, suffix: '' },
    { label: 'Avg Gas Saved', value: 0, target: 78, suffix: '%' },
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

  const chartData = [
    { day: 'Mon', value: 2400, height: '40%' },
    { day: 'Tue', value: 3210, height: '54%' },
    { day: 'Wed', value: 2290, height: '38%' },
    { day: 'Thu', value: 2000, height: '33%' },
    { day: 'Fri', value: 2181, height: '36%' },
    { day: 'Sat', value: 2500, height: '42%' },
    { day: 'Sun', value: 2100, height: '35%' },
  ];

  const networkData = [
    { name: 'Ethereum', percentage: 45, color: 'from-blue-500 to-blue-600' },
    { name: 'Polygon', percentage: 28, color: 'from-amber-500 to-amber-600' },
    { name: 'BSC', percentage: 18, color: 'from-yellow-500 to-yellow-600' },
    { name: 'Solana', percentage: 9, color: 'from-green-500 to-green-600' },
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return Math.floor(num).toString();
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-transparent to-dark-800 bg-opacity-40">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Network <span className="gradient-text">Analytics</span>
          </h2>
          <p className="text-cyber-300 max-w-2xl mx-auto">
            Real-time metrics showcasing x4 protocol performance across all networks
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="card group hover:border-primary-400"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-cyber-300 text-sm font-medium mb-2">{stat.label}</p>
                  <div className="text-3xl font-bold text-white">
                    {stat.suffix}{formatNumber(stat.value)}
                  </div>
                </div>
                <TrendingUp className="text-primary-500 group-hover:text-primary-400 transition-colors" size={24} />
              </div>
              <div className="w-full bg-dark-700 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-primary-500 to-primary-400 h-1.5 rounded-full transition-all duration-100"
                  style={{ width: `${(stat.value / stat.target) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Volume Chart */}
          <div className="card">
            <div className="flex items-center gap-3 mb-8">
              <BarChart3 className="text-primary-500" size={24} />
              <h3 className="text-xl font-bold">Weekly Volume</h3>
            </div>
            <div className="h-64 flex items-end justify-between gap-4 px-2">
              {chartData.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t opacity-70 hover:opacity-100 transition-opacity cursor-pointer group"
                    style={{ height: item.height }}>
                    <div className="w-full h-full rounded-t flex items-center justify-center text-xs font-bold text-dark-900 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.value}
                    </div>
                  </div>
                  <span className="text-xs text-cyber-300">{item.day}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-primary-500 border-opacity-20">
              <p className="text-sm text-cyber-300">
                <span className="text-primary-400 font-bold">+12.5%</span> increase from last week
              </p>
            </div>
          </div>

          {/* Network Distribution */}
          <div className="card">
            <div className="flex items-center gap-3 mb-8">
              <Activity className="text-primary-500" size={24} />
              <h3 className="text-xl font-bold">Network Distribution</h3>
            </div>
            <div className="space-y-6">
              {networkData.map((network, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-semibold">{network.name}</span>
                    <span className="text-primary-400 font-bold">{network.percentage}%</span>
                  </div>
                  <div className="w-full bg-dark-700 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${network.color} rounded-full transition-all duration-500 shadow-lg`}
                      style={{ width: `${network.percentage}%`, boxShadow: `0 0 20px rgba(244, 184, 26, 0.3)` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Transaction Flow Visualization */}
        <div className="card">
          <div className="flex items-center gap-3 mb-8">
            <Zap className="text-primary-500" size={24} />
            <h3 className="text-xl font-bold">Transaction Flow (Last 24h)</h3>
          </div>

          <div className="grid md:grid-cols-5 gap-4">
            {[
              { label: 'Initiated', count: 45230, color: 'from-blue-500 to-blue-600' },
              { label: 'Validated', count: 44980, color: 'from-cyan-500 to-cyan-600' },
              { label: 'Signed', count: 44720, color: 'from-amber-500 to-amber-600' },
              { label: 'Processed', count: 44650, color: 'from-yellow-500 to-yellow-600' },
              { label: 'Settled', count: 44500, color: 'from-primary-500 to-primary-600' },
            ].map((stage, idx) => (
              <div key={idx} className="text-center">
                <div className={`w-full h-32 bg-gradient-to-b ${stage.color} rounded-lg mb-4 flex items-center justify-center text-white font-bold text-lg opacity-80 hover:opacity-100 transition-opacity`}>
                  {stage.count.toLocaleString()}
                </div>
                <p className="text-sm text-cyber-300 font-medium">{stage.label}</p>
                {idx < 4 && <div className="text-primary-400 text-xl mt-2">→</div>}
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-dark-700 bg-opacity-50 rounded-lg border border-primary-500 border-opacity-20">
            <p className="text-sm text-cyber-300">
              <span className="text-primary-400 font-bold">Success Rate:</span> 99.87% •
              <span className="text-primary-400 font-bold ml-2">Avg Settlement:</span> 0.43s •
              <span className="text-primary-400 font-bold ml-2">Cost Saved:</span> $2.4M
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
