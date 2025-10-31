import React from 'react';
import { FileText, BookOpen, Github, Code2 } from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="space-y-32 py-20">
      {/* Header */}
      <section className="px-6 pt-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-x4-gold-400 mb-6">
            Documentation
          </h1>
          <p className="text-xl text-x4-silver-400">
            Complete guides, API references, and integration examples for x4 Protocol.
          </p>
        </div>
      </section>

      {/* Quick Start */}
      <section className="px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-x4-gold-400 mb-12">Quick Start</h2>

          <div className="space-y-8">
            {/* Installation */}
            <div className="border border-slate-700/50 rounded-lg p-8 bg-slate-900/30">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Code2 className="w-6 h-6 text-x4-gold-400" />
                Installation
              </h3>
              <pre className="bg-slate-900 border border-slate-700 rounded-lg p-4 overflow-x-auto">
                <code className="text-slate-200 text-sm">
                  {`npm install @zcdos/x4\n\n# or with yarn\nyarn add @zcdos/x4`}
                </code>
              </pre>
            </div>

            {/* Basic Usage */}
            <div className="border border-slate-700/50 rounded-lg p-8 bg-slate-900/30">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Code2 className="w-6 h-6 text-cyan-400" />
                Basic Usage
              </h3>
              <pre className="bg-slate-900 border border-slate-700 rounded-lg p-4 overflow-x-auto">
                <code className="text-slate-200 text-sm">
                  {`import { createX444Client } from '@zcdos/x4';

const client = createX444Client({
  chainId: 1,
  rpcUrl: 'https://eth.rpc.node'
});

// Initiate payment
const tx = await client.pay({
  to: '0x...',
  amount: '1.5',
  token: 'USDC'
});`}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* API Reference */}
      <section className="px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12">API Reference</h2>

          <div className="space-y-6">
            {[
              {
                name: 'createX444Client()',
                desc: 'Initialize x4 client with RPC configuration',
                params: 'chainId, rpcUrl, privateKey?',
              },
              {
                name: 'pay()',
                desc: 'Initiate a payment transaction',
                params: 'to, amount, token, nonce?',
              },
              {
                name: 'estimate()',
                desc: 'Estimate gas and fees for payment',
                params: 'to, amount, token',
              },
              {
                name: 'getStatus()',
                desc: 'Check payment status by hash',
                params: 'txHash',
              },
            ].map((api, i) => (
              <div key={i} className="border border-slate-700/50 rounded-lg p-6 bg-slate-900/20 hover:border-x4-gold-500/30 transition-all">
                <h4 className="text-lg font-semibold text-white mb-2 font-mono text-x4-gold-400">
                  {api.name}
                </h4>
                <p className="text-slate-300 mb-3">{api.desc}</p>
                <div className="text-sm text-slate-400">
                  <span className="font-semibold">Parameters:</span> {api.params}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation Sections */}
      <section className="px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12">Documentation</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: FileText,
                title: 'API Reference',
                desc: 'Complete API documentation with examples',
              },
              {
                icon: BookOpen,
                title: 'Integration Guide',
                desc: 'Step-by-step guides for integrating x4',
              },
              {
                icon: Code2,
                title: 'Code Examples',
                desc: 'Ready-to-use code snippets for common tasks',
              },
              {
                icon: Github,
                title: 'GitHub Repository',
                desc: 'Source code and open-source contributions',
              },
              {
                icon: FileText,
                title: 'Security Guide',
                desc: 'Security best practices and considerations',
              },
              {
                icon: BookOpen,
                title: 'FAQ',
                desc: 'Frequently asked questions and troubleshooting',
              },
            ].map((doc, i) => {
              const Icon = doc.icon;
              return (
                <a
                  key={i}
                  href="#"
                  className="group p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700/50 hover:border-x4-gold-500/50 rounded-xl transition-all hover:shadow-xl hover:shadow-x4-gold-500/10"
                >
                  <Icon className="w-8 h-8 text-x4-gold-400 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-x4-gold-400 transition-colors">
                    {doc.title}
                  </h3>
                  <p className="text-slate-400 text-sm">{doc.desc}</p>
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
