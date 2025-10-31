import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Zap, Users } from 'lucide-react';

// Mock data generator for realistic-looking data
const generateMockData = (length: number, baseValue: number, volatility: number) => {
  return Array.from({ length }, (_, i) => ({
    x: i,
    y: Math.max(0, baseValue + (Math.random() - 0.5) * volatility * baseValue)
  }));
};

// Animated number counter component
const AnimatedCounter = ({ targetValue, suffix = '', decimals = 0 }: { targetValue: number; suffix?: string; decimals?: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let animationFrame: number;
    let currentValue = 0;
    const step = targetValue / 30;

    const animate = () => {
      currentValue += step;
      if (currentValue < targetValue) {
        setDisplayValue(currentValue);
        animationFrame = requestAnimationFrame(animate);
      } else {
        setDisplayValue(targetValue);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [targetValue]);

  return (
    <span>
      {displayValue.toFixed(decimals)}{suffix}
    </span>
  );
};

// Simple Line Chart Component
const SimpleLineChart = ({ data, height = 120, color = 'rgb(249, 115, 22)' }: { data: Array<{ x: number; y: number }>; height?: number; color?: string }) => {
  if (!data.length) return null;

  const minY = Math.min(...data.map(d => d.y));
  const maxY = Math.max(...data.map(d => d.y));
  const range = maxY - minY || 1;

  const padding = { top: 10, right: 10, bottom: 10, left: 10 };
  const width = data.length * 3;
  const viewBoxHeight = height;
  const viewBoxWidth = data.length * 3;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * (viewBoxWidth - padding.left - padding.right) + padding.left;
    const y = viewBoxHeight - ((d.y - minY) / range) * (viewBoxHeight - padding.top - padding.bottom) - padding.bottom;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} className="w-full h-full" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
      <polyline
        points={points}
        fill={`url(#gradient-${Date.now()})`}
        fillOpacity="0.1"
        stroke="none"
      />
      <defs>
        <linearGradient id={`gradient-${Date.now()}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// Dashboard Card Component
const DashboardCard = ({
  title,
  value,
  suffix = '',
  icon: Icon,
  trend = 5,
  data,
  color = 'orange'
}: {
  title: string;
  value: number;
  suffix?: string;
  icon: React.ComponentType<any>;
  trend?: number;
  data?: Array<{ x: number; y: number }>;
  color?: string;
}) => {
  const colorMap = {
    orange: { bg: 'from-orange-600/20 to-orange-700/10', text: 'text-orange-400', icon: 'text-orange-500' },
    yellow: { bg: 'from-yellow-600/20 to-yellow-700/10', text: 'text-yellow-400', icon: 'text-yellow-500' },
    blue: { bg: 'from-blue-600/20 to-blue-700/10', text: 'text-blue-400', icon: 'text-blue-500' },
    green: { bg: 'from-green-600/20 to-green-700/10', text: 'text-green-400', icon: 'text-green-500' },
  };

  const colorScheme = colorMap[color as keyof typeof colorMap] || colorMap.orange;

  return (
    <div className={`bg-gradient-to-br ${colorScheme.bg} border border-slate-700/50 rounded-xl p-6 hover:border-slate-600 transition-all duration-300 hover:shadow-lg`}>
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <p className="text-slate-400 text-sm font-medium mb-2">{title}</p>
          <div className={`text-4xl font-bold ${colorScheme.text}`}>
            <AnimatedCounter targetValue={value} suffix={suffix} decimals={suffix === '$' ? 0 : 2} />
          </div>
          {trend !== 0 && (
            <p className={`text-sm mt-2 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% this week
            </p>
          )}
        </div>
        <div className={`${colorScheme.icon} opacity-80`}>
          <Icon size={32} />
        </div>
      </div>
      {data && (
        <div className="h-16">
          <SimpleLineChart data={data} color={colorScheme.text.replace('text-', 'rgb(').replace('-400', ', 180)')} />
        </div>
      )}
    </div>
  );
};

// Advanced Metrics Section
export const AdvancedMetrics = () => {
  // Generate mock data for demo (in production, replace with real API)
  const transactionData = generateMockData(30, 500, 200);
  const adopterData = generateMockData(30, 2000, 800);
  const stakingData = generateMockData(30, 150000, 50000);
  const volumeData = generateMockData(30, 25000, 10000);

  return (
    <div className="space-y-8">
      {/* Key Metrics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Daily Transactions"
          value={1243}
          suffix=" txs"
          icon={Zap}
          trend={12}
          data={transactionData}
          color="orange"
        />
        <DashboardCard
          title="Active Merchants"
          value={348}
          suffix=" live"
          icon={Users}
          trend={8}
          data={adopterData}
          color="yellow"
        />
        <DashboardCard
          title="x4 Staked"
          value={1500000}
          suffix=" X4"
          icon={TrendingUp}
          trend={15}
          data={stakingData}
          color="green"
        />
        <DashboardCard
          title="Monthly Volume"
          value={750000}
          suffix="$"
          icon={DollarSign}
          trend={22}
          data={volumeData}
          color="blue"
        />
      </div>

      {/* Large Chart Section */}
      <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-slate-700/50 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-8">30-Day Transaction Trend</h2>
        <div className="space-y-6">
          {/* Transaction Volume Chart */}
          <div>
            <p className="text-slate-400 text-sm mb-4">Transaction Volume Growth</p>
            <div className="h-48 w-full">
              <SimpleLineChart data={transactionData} height={200} color="rgb(249, 115, 22)" />
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid md:grid-cols-4 gap-4 pt-6 border-t border-slate-700/50">
            {[
              { label: 'Avg per day', value: '1,243', color: 'text-orange-400' },
              { label: 'Peak day', value: '2,891', color: 'text-yellow-400' },
              { label: 'Low day', value: '342', color: 'text-blue-400' },
              { label: 'Total', value: '37,290', color: 'text-green-400' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-slate-400 text-xs uppercase mb-2">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Network Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { label: 'Facilitators Active', value: '87', trend: '+12 this month' },
          { label: 'Tokens Whitelisted', value: '23', trend: '+5 this month' },
          { label: 'Network Health', value: '99.8%', trend: 'All systems optimal' },
        ].map((stat, i) => (
          <div key={i} className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-orange-500/50 transition-colors">
            <p className="text-slate-400 text-sm mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-orange-400 mb-2">{stat.value}</p>
            <p className="text-xs text-slate-500">{stat.trend}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Real-time Status Indicator
export const RealtimeStatus = () => {
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(prev => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-green-600/20 to-green-700/10 border border-green-500/30 rounded-full">
      <div className={`w-2 h-2 rounded-full bg-green-500 ${pulse ? 'animate-pulse' : ''}`}></div>
      <span className="text-green-400 text-sm font-medium">Live Data Streaming</span>
    </div>
  );
};

export default AdvancedMetrics;
