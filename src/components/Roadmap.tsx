import { useEffect, useState } from 'react';
import { CheckCircle2, Clock, Lock, Target } from 'lucide-react';

interface RoadmapPhase {
  quarter: string;
  title: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  items: string[];
  completion?: number;
}

const Roadmap: React.FC = () => {
  const [visiblePhases, setVisiblePhases] = useState<number[]>([]);
  const [itemVisibility, setItemVisibility] = useState<Record<string, boolean>>({});

  const phases: RoadmapPhase[] = [
    {
      quarter: 'Q1 2024',
      title: 'Foundation',
      status: 'completed',
      completion: 100,
      items: ['x444 Protocol Launch', 'BSC Integration', 'Core Smart Contracts'],
    },
    {
      quarter: 'Q2 2024',
      title: 'Growth',
      status: 'completed',
      completion: 100,
      items: ['Multi-Chain Support', 'Developer Tools', 'Analytics Dashboard'],
    },
    {
      quarter: 'Q3 2024',
      title: 'Expansion',
      status: 'completed',
      completion: 100,
      items: ['Base Integration', 'Arbitrum Support', 'Community Governance'],
    },
    {
      quarter: 'Q4 2024',
      title: 'Optimization',
      status: 'in-progress',
      completion: 65,
      items: ['Gas Optimization', 'Security Audit', 'Mobile Support'],
    },
    {
      quarter: 'Q1 2025',
      title: 'x4 Token Launch',
      status: 'upcoming',
      completion: 0,
      items: ['Token Distribution', 'Staking Protocol', 'Fee Mechanism'],
    },
    {
      quarter: 'Q2 2025',
      title: 'Ecosystem',
      status: 'upcoming',
      completion: 0,
      items: ['NFT Payments', 'Cross-Chain Bridge', 'Enterprise Solutions'],
    },
  ];

  useEffect(() => {
    // Stagger animation of phases with enhanced timing
    phases.forEach((_, i) => {
      setTimeout(() => {
        setVisiblePhases(prev => [...prev, i]);

        // Stagger item visibility within each phase
        _.items.forEach((_, j) => {
          setTimeout(() => {
            setItemVisibility(prev => ({
              ...prev,
              [`${i}-${j}`]: true,
            }));
          }, j * 100);
        });
      }, i * 200);
    });
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-6 h-6 text-green-400 animate-bounce" />;
      case 'in-progress':
        return <Clock className="w-6 h-6 text-yellow-400 animate-spin" />;
      case 'upcoming':
        return <Lock className="w-6 h-6 text-slate-400" />;
      default:
        return null;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          bg: 'bg-gradient-to-br from-green-900/30 to-green-800/30',
          border: 'border-green-500/30',
          dotBorder: 'border-green-500',
          dotBg: 'bg-green-600/20',
          text: 'text-white',
          subtitle: 'text-slate-300',
          icon: 'text-green-400',
        };
      case 'in-progress':
        return {
          bg: 'bg-gradient-to-br from-yellow-900/30 to-yellow-800/30',
          border: 'border-yellow-500/30',
          dotBorder: 'border-yellow-500',
          dotBg: 'bg-yellow-600/20',
          text: 'text-white',
          subtitle: 'text-slate-300',
          icon: 'text-yellow-400',
        };
      case 'upcoming':
        return {
          bg: 'bg-gradient-to-br from-slate-900/20 to-slate-800/20',
          border: 'border-slate-700/30',
          dotBorder: 'border-slate-600',
          dotBg: 'bg-slate-700/20',
          text: 'text-slate-300',
          subtitle: 'text-slate-500',
          icon: 'text-slate-400',
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-slate-900/20 to-slate-800/20',
          border: 'border-slate-700/30',
          dotBorder: 'border-slate-600',
          dotBg: 'bg-slate-700/20',
          text: 'text-slate-300',
          subtitle: 'text-slate-500',
          icon: 'text-slate-400',
        };
    }
  };

  const completionColor = (completion: number) => {
    if (completion === 100) return 'bg-gradient-to-r from-green-600 to-green-400';
    if (completion >= 50) return 'bg-gradient-to-r from-yellow-600 to-yellow-400';
    return 'bg-gradient-to-r from-slate-600 to-slate-500';
  };

  return (
    <div className="w-full">
      <div className="mb-12">
        <div className="flex items-center gap-3 justify-center mb-4">
          <Target className="w-8 h-8 text-x4-gold-400" />
          <h2 className="text-4xl font-bold text-white">Development Roadmap</h2>
        </div>
        <p className="text-center text-slate-300 max-w-2xl mx-auto">
          Building the future of payments - tracking progress across all development phases
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line - animated gradient */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-x4-gold-500 via-yellow-500 via-slate-600 to-slate-700/30" />

        {/* Phases */}
        <div className="space-y-12">
          {phases.map((phase, i) => {
            const styles = getStatusStyles(phase.status);

            return (
              <div
                key={i}
                className={`opacity-0 transform transition-all duration-700 ${
                  visiblePhases.includes(i) ? 'opacity-100 translate-y-0' : 'translate-y-8 pointer-events-none'
                }`}
              >
                {/* Content card */}
                <div className={`${i % 2 === 0 ? 'mr-auto md:mr-1/2 md:pr-16' : 'ml-auto md:ml-1/2 md:pl-16'} w-full md:w-1/2`}>
                  <div className={`relative p-6 rounded-lg border ${styles.bg} ${styles.border} hover:shadow-lg transition-all duration-300 group cursor-pointer hover:scale-105`}>
                    {/* Status badge */}
                    <div className="absolute -top-3 right-4 flex items-center gap-2 px-3 py-1 bg-slate-950 border border-slate-700 rounded-full">
                      <span className={`text-xs font-semibold uppercase tracking-wide ${
                        phase.status === 'completed' ? 'text-green-400' :
                        phase.status === 'in-progress' ? 'text-yellow-400' :
                        'text-slate-400'
                      }`}>
                        {phase.status === 'in-progress' ? 'In Progress' : phase.status}
                      </span>
                    </div>

                    {/* Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(phase.status)}
                      </div>
                      <div className="flex-1">
                        <p className={`text-xs font-semibold uppercase tracking-widest ${styles.subtitle} mb-1`}>
                          {phase.quarter}
                        </p>
                        <h3 className={`text-2xl font-bold ${styles.text} group-hover:text-x4-gold-300 transition-colors`}>
                          {phase.title}
                        </h3>
                      </div>
                    </div>

                    {/* Progress bar */}
                    {phase.completion !== undefined && (
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex-1 h-2 bg-slate-700/50 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${completionColor(phase.completion)} transition-all duration-500`}
                            style={{ width: `${phase.completion}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-slate-300 w-12 text-right">
                          {phase.completion}%
                        </span>
                      </div>
                    )}

                    {/* Items */}
                    <ul className="space-y-3">
                      {phase.items.map((item, j) => (
                        <li
                          key={j}
                          className={`text-sm flex items-start gap-3 opacity-0 transform transition-all duration-500 ${
                            itemVisibility[`${i}-${j}`]
                              ? 'opacity-100 translate-x-0'
                              : '-translate-x-4 pointer-events-none'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 bg-gradient-to-r from-x4-gold-500 to-yellow-400" />
                          <span className={styles.subtitle}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Timeline dot - with pulse effect for active phases */}
                <div className="absolute left-1/2 top-6 transform -translate-x-1/2 z-10">
                  {phase.status === 'in-progress' && (
                    <div className={`absolute inset-0 rounded-full ${styles.dotBg} animate-pulse`} style={{
                      width: 'calc(100% + 8px)',
                      height: 'calc(100% + 8px)',
                      top: '-4px',
                      left: '-4px',
                    }} />
                  )}
                  <div className={`w-5 h-5 bg-slate-950 border-3 ${styles.dotBorder} rounded-full transition-all duration-300 ${
                    phase.status === 'in-progress' ? 'shadow-lg shadow-yellow-500/50' : ''
                  }`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-16 flex flex-wrap justify-center gap-8 p-6 bg-slate-900/30 border border-slate-700/50 rounded-lg">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <span className="text-sm text-slate-300">Completed</span>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-yellow-400 animate-spin" />
          <span className="text-sm text-slate-300">In Progress</span>
        </div>
        <div className="flex items-center gap-3">
          <Lock className="w-5 h-5 text-slate-400" />
          <span className="text-sm text-slate-300">Upcoming</span>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
