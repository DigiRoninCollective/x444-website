import { useEffect, useState } from 'react';
import { Users, Activity, TrendingUp, DollarSign } from 'lucide-react';

interface MetricData {
  label: string;
  value: number;
  target: number;
  progress: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const AdoptionMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [displayValues, setDisplayValues] = useState<number[]>([0, 0, 0, 0]);

  const metricConfigs = [
    {
      label: 'Active Users',
      value: 45000,
      target: 50000,
      icon: <Users className="w-5 h-5" />,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20 border-blue-500/30',
      gradientFrom: 'from-blue-600',
      gradientTo: 'to-blue-400',
    },
    {
      label: 'Total Transactions',
      value: 234000,
      target: 250000,
      icon: <Activity className="w-5 h-5" />,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20 border-yellow-500/30',
      gradientFrom: 'from-yellow-600',
      gradientTo: 'to-yellow-400',
    },
    {
      label: 'Network Coverage',
      value: 5,
      target: 8,
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20 border-green-500/30',
      gradientFrom: 'from-green-600',
      gradientTo: 'to-green-400',
    },
    {
      label: 'Total Value Locked',
      value: 28500000,
      target: 50000000,
      icon: <DollarSign className="w-5 h-5" />,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20 border-orange-500/30',
      gradientFrom: 'from-orange-600',
      gradientTo: 'to-orange-400',
    },
  ];

  useEffect(() => {
    const animationDuration = 2000;
    const startTime = Date.now();
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      const eased = easeOutCubic(progress);

      const newMetrics = metricConfigs.map(config => ({
        ...config,
        progress: eased,
      }));

      const newDisplayValues = metricConfigs.map(config =>
        Math.floor(config.value * eased),
      );

      setMetrics(newMetrics);
      setDisplayValues(newDisplayValues);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, []);

  const formatValue = (value: number, index: number): string => {
    if (index === 2) return `${value}/8`; // Networks
    if (index === 3) return `$${(value / 1000000).toFixed(1)}M`; // TVL
    return value.toLocaleString();
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, i) => {
        const percentage = (displayValues[i] / metricConfigs[i].target) * 100;
        const isNearTarget = percentage >= 80;

        return (
          <div
            key={i}
            className={`p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-slate-700/50 hover:${metricConfigs[i].bgColor.split(' ')[0]} rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-${metricConfigs[i].color.split('-')[1]}-500/20 group`}
          >
            {/* Header with icon */}
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">
                {metric.label}
              </h4>
              <div className={`p-2 rounded-lg ${metricConfigs[i].bgColor}`}>
                <span className={metric.color}>{metric.icon}</span>
              </div>
            </div>

            {/* Main value */}
            <div className="mb-5">
              <p className="text-3xl font-bold text-white mb-1">
                {formatValue(displayValues[i], i)}
              </p>
              <p className="text-xs text-slate-400">
                <span className="text-slate-500">Target:</span>{' '}
                {formatValue(metricConfigs[i].target, i)}
              </p>
            </div>

            {/* Progress visualization */}
            <div className="space-y-2">
              {/* Circular progress */}
              <div className="flex items-center justify-between">
                <div className="relative w-12 h-12">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="rgba(71, 85, 105, 0.3)"
                      strokeWidth="3"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke={
                        i === 0 ? '#60a5fa' :
                        i === 1 ? '#facc15' :
                        i === 2 ? '#4ade80' :
                        '#fb923c'
                      }
                      strokeWidth="3"
                      strokeDasharray={`${(percentage / 100) * 283} 283`}
                      strokeLinecap="round"
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {Math.min(Math.round(percentage), 100)}%
                    </span>
                  </div>
                </div>

                {/* Status indicator */}
                <div className="flex-1 ml-4">
                  <div className={`text-xs font-semibold px-2 py-1 rounded-full w-fit ${
                    percentage >= 100
                      ? 'bg-green-500/20 text-green-300'
                      : isNearTarget
                      ? 'bg-yellow-500/20 text-yellow-300'
                      : 'bg-slate-700/50 text-slate-300'
                  }`}>
                    {percentage >= 100 ? '✓ Target met' : `${Math.round(100 - percentage)}% to go`}
                  </div>
                </div>
              </div>

              {/* Linear progress bar */}
              <div className="w-full h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${metricConfigs[i].gradientFrom} ${metricConfigs[i].gradientTo} transition-all duration-300`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>

            {/* Live indicator */}
            {metric.progress > 0.8 && (
              <div className="mt-4 flex items-center gap-2 text-xs text-green-400">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span>Live</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AdoptionMetrics;
