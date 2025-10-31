import React, { useState, useEffect } from 'react';
import { Zap, CheckCircle, Clock, DollarSign } from 'lucide-react';

export default function Demo() {
  const [activeStep, setActiveStep] = useState(0);
  const [animateValue, setAnimateValue] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeStep === 3) {
      setAnimateValue(0);
      const timer = setTimeout(() => setAnimateValue(100), 100);
      return () => clearTimeout(timer);
    }
  }, [activeStep]);

  const steps = [
    { icon: Zap, label: 'Initiate', desc: 'Start payment request' },
    { icon: CheckCircle, label: 'Validate', desc: 'Protocol verification' },
    { icon: Clock, label: 'Process', desc: 'Execute settlement' },
    { icon: DollarSign, label: 'Complete', desc: 'Funds transferred' },
  ];

  const transactionData = [
    { metric: 'Amount', value: '$1,234.56', color: 'text-primary-400' },
    { metric: 'Gas Cost', value: '$0.00', color: 'text-green-400' },
    { metric: 'Time', value: '0.43s', color: 'text-cyber-400' },
    { metric: 'Status', value: 'Success', color: 'text-green-400' },
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-transparent to-dark-800 bg-opacity-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Payment <span className="gradient-text">Flow</span>
          </h2>
          <p className="text-xl text-cyber-300">
            Watch how x4 executes payments in real-time
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Transaction Flow Visualization */}
          <div className="card">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
              <Zap className="text-primary-500" size={24} />
              Transaction Flow
            </h3>

            {/* Visual Flow */}
            <div className="space-y-6 mb-10">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isActive = idx <= activeStep;
                const isCurrent = idx === activeStep;

                return (
                  <div key={idx}>
                    <div className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                      isCurrent ? 'bg-primary-500 bg-opacity-20 border border-primary-500' :
                      isActive ? 'bg-dark-700 border border-primary-500 border-opacity-30' :
                      'bg-dark-800 border border-primary-500 border-opacity-10'
                    }`}>
                      <div className={`p-3 rounded-full ${
                        isActive ? 'bg-primary-500 text-dark-900' : 'bg-dark-700 text-cyber-300'
                      }`}>
                        <Icon size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-white">{step.label}</p>
                        <p className="text-sm text-cyber-300">{step.desc}</p>
                      </div>
                      {isActive && <div className="animate-pulse w-2 h-2 bg-primary-400 rounded-full" />}
                    </div>
                    {idx < steps.length - 1 && (
                      <div className={`h-4 ml-8 border-l-2 ${isActive ? 'border-primary-500' : 'border-dark-700'}`} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-dark-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary-500 to-primary-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Transaction Details */}
          <div className="card">
            <h3 className="text-xl font-bold mb-8">Transaction Details</h3>

            <div className="space-y-4 mb-8">
              {transactionData.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 bg-dark-700 bg-opacity-50 rounded-lg hover:bg-opacity-75 transition-all">
                  <span className="text-cyber-300 font-medium">{item.metric}</span>
                  <span className={`font-bold text-lg ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>

            {/* Success Indicator */}
            {activeStep === 3 && (
              <div className="relative h-20 flex items-center justify-center mb-6">
                <div className="absolute inset-0 bg-green-500 rounded-lg opacity-10" />
                <div className="relative text-center">
                  <p className="text-green-400 font-bold text-sm mb-1">TRANSACTION COMPLETE</p>
                  <p className="text-white font-bold text-2xl">Payment Settled</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <button className="w-full btn btn-primary mb-3">
              Try Demo
            </button>
            <button className="w-full btn btn-secondary">
              View Code
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-4 mt-12">
          {[
            { label: 'Settlement Speed', value: '< 1 second', icon: Clock },
            { label: 'Success Rate', value: '99.87%', icon: CheckCircle },
            { label: 'Gas Savings', value: '100%', icon: Zap },
            { label: 'Avg Cost', value: '$0.00', icon: DollarSign },
          ].map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <div key={idx} className="card text-center">
                <Icon className="text-primary-500 mx-auto mb-3" size={24} />
                <p className="text-cyber-300 text-sm mb-2">{metric.label}</p>
                <p className="text-2xl font-bold gradient-text">{metric.value}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
