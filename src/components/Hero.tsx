import { ArrowRight } from 'lucide-react';
import VoiceButton from './VoiceButton';
import { useVoice } from '../hooks/useVoice';
import AnimatedGhost from './AnimatedGhost';

export default function Hero() {
  const { isConfigured } = useVoice();

  const heroText = 'x4 is the utility token powering the HTTP 402 payment protocol. Built on x444 protocol layer and x402 infrastructure, x4 enables instant, gasless payments for memecoins and stablecoins on BSC.';

  return (
    <section className="pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Animated Ghost Decorations - Very Subtle */}
      <div className="fixed left-0 top-32 pointer-events-none">
        <AnimatedGhost position="left" size="large" opacity={0.05} delay={0} />
      </div>
      <div className="fixed right-0 top-40 pointer-events-none">
        <AnimatedGhost position="right" size="large" opacity={0.05} delay={0.5} />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="space-y-8">
          {/* Headline */}
          <div>
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <p className="text-lg text-slate-400 mb-4">
                  HTTP 402 Payment Protocol
                </p>
                <h1 className="text-6xl md:text-7xl font-bold text-white leading-tight mb-8">
                  <span className="gradient-text">x4</span>
                </h1>
                <p className="text-2xl text-slate-300 max-w-3xl mb-6">
                  The utility token powering instant, gasless payments for memecoins and stablecoins on BSC.
                </p>
                <p className="text-lg text-slate-400 max-w-3xl">
                  The HTTP 402 Payment Protocol reimagined for memecoins, stablecoins, and volatile assets. Zero friction settlement on BSC.
                </p>
              </div>
              {isConfigured && (
                <VoiceButton
                  text={heroText}
                  variant="icon"
                  tooltipText="Listen to hero section"
                  className="mt-2 text-x4-gold-500"
                />
              )}
            </div>
          </div>

          {/* CTA Button */}
          <div>
            <button className="btn btn-primary group text-base">
              Read Documentation
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-slate-800">
            <div>
              <div className="text-3xl font-bold bg-gradient-to-r from-x4-gold-400 to-yellow-400 bg-clip-text text-transparent mb-1">5+</div>
              <div className="text-sm text-slate-400">Networks</div>
            </div>
            <div>
              <div className="text-3xl font-bold bg-gradient-to-r from-x4-gold-400 to-yellow-400 bg-clip-text text-transparent mb-1">&lt;1s</div>
              <div className="text-sm text-slate-400">Settlement</div>
            </div>
            <div>
              <div className="text-3xl font-bold bg-gradient-to-r from-x4-gold-400 to-yellow-400 bg-clip-text text-transparent mb-1">$0</div>
              <div className="text-sm text-slate-400">Gas Fees</div>
            </div>
            <div>
              <div className="text-3xl font-bold bg-gradient-to-r from-x4-gold-400 to-yellow-400 bg-clip-text text-transparent mb-1">Open</div>
              <div className="text-sm text-slate-400">Source</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
