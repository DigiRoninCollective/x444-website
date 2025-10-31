import React from 'react';
import { Building2, Users, Zap } from 'lucide-react';

const ecosystem = [
  {
    icon: Building2,
    title: 'Built By',
    items: ['ZCDOS', 'Open Source Community'],
  },
  {
    icon: Users,
    title: 'For Developers',
    items: ['API Providers', 'DeFi Protocols', 'Web3 Apps'],
  },
  {
    icon: Zap,
    title: 'Powered By',
    items: ['Ethereum', 'Polygon', 'Solana', 'More...'],
  },
];

export default function Ecosystem() {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-transparent to-dark-800 bg-opacity-40">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Part of the <span className="gradient-text">x4 Ecosystem</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {ecosystem.map((section, index) => {
            const Icon = section.icon;
            return (
              <div key={index} className="card text-center">
                <Icon className="text-primary-500 mx-auto mb-4" size={40} />
                <h3 className="text-2xl font-bold mb-6">{section.title}</h3>
                <div className="space-y-3">
                  {section.items.map((item, i) => (
                    <div key={i} className="text-gray-400 font-medium">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
