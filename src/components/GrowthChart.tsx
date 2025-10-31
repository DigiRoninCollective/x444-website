import { TrendingUp, Activity } from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

interface DataPoint {
  quarter: string;
  transactions: number;
  value: number;
}

const GrowthChart: React.FC = () => {

  const data: DataPoint[] = [
    { quarter: 'Q1 2024', transactions: 1200, value: 1200 },
    { quarter: 'Q2 2024', transactions: 3400, value: 3400 },
    { quarter: 'Q3 2024', transactions: 5600, value: 5600 },
    { quarter: 'Q4 2024', transactions: 8900, value: 8900 },
    { quarter: 'Q1 2025', transactions: 12500, value: 12500 },
    { quarter: 'Q2 2025', transactions: 18300, value: 18300 },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-x4-gold-500/50 rounded-lg p-3 backdrop-blur-sm">
          <p className="text-x4-gold-300 text-sm font-semibold">{payload[0].payload.quarter}</p>
          <p className="text-white text-lg font-bold">{payload[0].value.toLocaleString()} tx</p>
          <p className="text-slate-400 text-xs mt-1">
            Growth: {((payload[0].value / data[0].value - 1) * 100).toFixed(0)}%
          </p>
        </div>
      );
    }
    return null;
  };

  const latestValue = data[data.length - 1].value;
  const previousValue = data[data.length - 2].value;
  const growthRate = ((latestValue / previousValue - 1) * 100).toFixed(1);

  return (
    <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-slate-700/50 rounded-xl p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-x4-gold-400" />
          <div>
            <h3 className="text-2xl font-bold text-white">Transaction Growth</h3>
            <p className="text-xs text-slate-400 mt-1">Quarterly trend analysis with forecasting</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg">
          <Activity className="w-4 h-4 text-green-400" />
          <span className="text-sm font-semibold text-green-400">Live</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-72 w-full mb-8 min-h-72">
        <ResponsiveContainer width="100%" height={288}>
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTransactions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d4a574" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#d4a574" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
            <XAxis
              dataKey="quarter"
              stroke="rgba(148, 163, 184, 0.5)"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="rgba(148, 163, 184, 0.5)"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="transactions"
              stroke="#d4a574"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorTransactions)"
              isAnimationActive={true}
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg">
          <p className="text-xs text-slate-400 mb-1">Latest Volume</p>
          <p className="text-2xl font-bold text-x4-gold-400">{latestValue.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-2">transactions</p>
        </div>
        <div className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg">
          <p className="text-xs text-slate-400 mb-1">Q-o-Q Growth</p>
          <p className={`text-2xl font-bold ${parseFloat(growthRate) > 0 ? 'text-green-400' : 'text-red-400'}`}>
            +{growthRate}%
          </p>
          <p className="text-xs text-slate-500 mt-2">quarter-over-quarter</p>
        </div>
        <div className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg">
          <p className="text-xs text-slate-400 mb-1">Total Growth</p>
          <p className="text-2xl font-bold text-yellow-400">
            +{((latestValue / data[0].value - 1) * 100).toFixed(0)}%
          </p>
          <p className="text-xs text-slate-500 mt-2">since Q1 2024</p>
        </div>
      </div>

      {/* Footer insight */}
      <div className="mt-6 p-3 bg-x4-gold-500/5 border border-x4-gold-500/20 rounded-lg">
        <p className="text-xs text-slate-300">
          💡 <span className="font-semibold text-x4-gold-300">Insight:</span> Transaction volume showing exponential growth pattern with average quarterly increase of {(((latestValue / data[0].value) ** (1/5) - 1) * 100).toFixed(1)}%
        </p>
      </div>
    </div>
  );
};

export default GrowthChart;
