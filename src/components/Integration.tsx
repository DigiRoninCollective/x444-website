import React from 'react';

export default function Integration() {
  return (
    <section id="integration" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">5 Minutes to Integration</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-6">Server Setup</h3>
            <pre className="bg-dark-800 border border-primary-500 border-opacity-30 rounded-lg p-4 overflow-auto text-sm">
{`import { createX444Express } from '@zcdos/x444/middleware';

const x444 = createX444Express({
  receiverAddress: '0x...',
  priceOracle: new CoinGeckoOracle(),
});

app.get('/api/premium',
  x444.requiresPayment({
    priceUSD: 0.05,
    description: 'Premium API'
  }),
  (req, res) => {
    res.json({ data: 'Premium content' });
  }
);`}
            </pre>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-6">Client Usage</h3>
            <pre className="bg-dark-800 border border-primary-500 border-opacity-30 rounded-lg p-4 overflow-auto text-sm">
{`import { createX444Client } from '@zcdos/x444';

const client = await createX444Client(
  'https://api.example.com'
);

await client.connectWallet();

const response = await client.fetch(
  '/api/premium'
);

const data = await response.json();`}
            </pre>
          </div>
        </div>

        <div className="mt-12 p-8 bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Start?</h3>
          <p className="mb-6 text-white">Follow our quick start guide and integrate x444 into your application today.</p>
          <button className="btn btn-secondary text-primary-900 font-bold">View Quick Start Guide</button>
        </div>
      </div>
    </section>
  );
}
