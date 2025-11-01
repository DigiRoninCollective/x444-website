import React, { useState } from 'react';
import { Copy, CheckCircle2, ExternalLink } from 'lucide-react';

export default function WidgetBuilderPage() {
  const [config, setConfig] = useState({
    linkId: 'your_payment_link_id',
    theme: 'dark',
    elementId: 'x444-payment',
  });

  const [copied, setCopied] = useState(false);

  const generatedCode = `<!-- Include X444 Payment Widget -->
<script src="https://cdn.x444.xyz/widget.js"></script>

<!-- Payment Widget Container -->
<div id="${config.elementId}"></div>

<!-- Initialize Widget -->
<script>
  X444.init({
    elementId: '${config.elementId}',
    linkId: '${config.linkId}',
    theme: '${config.theme}',
    onSuccess: (txHash, amount, token) => {
      console.log('Payment successful!', txHash);
      // Add your success logic here
      // Example: window.location.href = '/thank-you?tx=' + txHash;
    },
    onError: (error) => {
      console.error('Payment failed:', error);
      // Add your error handling here
    }
  });
</script>`;

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-x4-gold-400 to-yellow-400 bg-clip-text text-transparent">
            Memecoin Payment Widget Builder
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Accept DEGEN, PEPE, SHIB, DOGE and other memecoins on your website.
            Configure and generate your embeddable payment widget in seconds.
          </p>
          <p className="text-sm text-slate-500 mt-2">
            x444 = Memecoin Payment Layer • Built on HTTP 402 Protocol
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-x4-gold-400 mb-6">Configuration</h2>

              {/* Link ID */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">
                  Payment Link ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={config.linkId}
                  onChange={(e) => setConfig({ ...config, linkId: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-x4-gold-500"
                  placeholder="your_payment_link_id"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Get your Link ID from the{' '}
                  <a href="/dashboard" className="text-x4-gold-400 hover:underline">
                    Creator Dashboard
                  </a>
                </p>
              </div>

              {/* Element ID */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">
                  Container Element ID
                </label>
                <input
                  type="text"
                  value={config.elementId}
                  onChange={(e) => setConfig({ ...config, elementId: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-x4-gold-500"
                  placeholder="x444-payment"
                />
                <p className="text-xs text-slate-500 mt-2">
                  The HTML element ID where the widget will be mounted
                </p>
              </div>

              {/* Theme */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  {['dark', 'light', 'minimal'].map((theme) => (
                    <button
                      key={theme}
                      onClick={() => setConfig({ ...config, theme })}
                      className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                        config.theme === theme
                          ? 'bg-x4-gold-500 text-black'
                          : 'bg-slate-800 text-white hover:bg-slate-700'
                      }`}
                    >
                      {theme.charAt(0).toUpperCase() + theme.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Tips */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <h3 className="font-semibold text-x4-gold-400 mb-2">💡 x444 = Memecoin Payments</h3>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• Specifically built for memecoins and volatile assets</li>
                  <li>• Real-time pricing with oracle integration</li>
                  <li>• Supports DEGEN, PEPE, SHIB, BONK, DOGE, and more</li>
                  <li>• Gasless payments - users pay zero fees</li>
                </ul>
              </div>
            </div>

            {/* Installation Steps */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-x4-gold-400 mb-4">Installation Steps</h2>
              <ol className="space-y-3 text-slate-300">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-x4-gold-500 text-black text-sm font-bold flex items-center justify-center">
                    1
                  </span>
                  <span>Copy the generated code from the right panel</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-x4-gold-500 text-black text-sm font-bold flex items-center justify-center">
                    2
                  </span>
                  <span>Paste it into your HTML file where you want the widget</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-x4-gold-500 text-black text-sm font-bold flex items-center justify-center">
                    3
                  </span>
                  <span>Replace 'your_payment_link_id' with your actual Link ID</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-x4-gold-500 text-black text-sm font-bold flex items-center justify-center">
                    4
                  </span>
                  <span>Test your widget and start accepting payments!</span>
                </li>
              </ol>

              <div className="mt-6 pt-6 border-t border-slate-800">
                <a
                  href="/widget-example.html"
                  target="_blank"
                  className="flex items-center gap-2 text-x4-gold-400 hover:text-x4-gold-300"
                >
                  <ExternalLink size={16} />
                  View Live Examples
                </a>
              </div>
            </div>
          </div>

          {/* Code Output Panel */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-x4-gold-400">Generated Code</h2>
                <button
                  onClick={copyCode}
                  className="flex items-center gap-2 px-4 py-2 bg-x4-gold-500 hover:bg-x4-gold-600 text-black font-semibold rounded-lg transition-all"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 size={16} />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      Copy Code
                    </>
                  )}
                </button>
              </div>

              <pre className="bg-slate-950 border border-slate-800 rounded-lg p-4 overflow-x-auto">
                <code className="text-sm text-green-400">{generatedCode}</code>
              </pre>

              {/* Live Preview */}
              <div className="mt-6 pt-6 border-t border-slate-800">
                <h3 className="font-semibold text-white mb-4">Live Preview</h3>
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-6">
                  <div className="text-center text-slate-500">
                    <p className="mb-2">Widget preview would appear here</p>
                    <p className="text-xs">
                      (Requires actual payment link ID to render)
                    </p>
                  </div>
                </div>
              </div>

              {/* Documentation Link */}
              <div className="mt-6 pt-6 border-t border-slate-800">
                <a
                  href="/WIDGET_DOCUMENTATION.md"
                  target="_blank"
                  className="flex items-center gap-2 text-x4-gold-400 hover:text-x4-gold-300"
                >
                  <ExternalLink size={16} />
                  View Full Documentation
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Widget Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: '⚡ Zero Gas Fees',
                desc: 'Users pay zero transaction fees. Protocol absorbs all gas costs.',
              },
              {
                title: '🎨 Fully Customizable',
                desc: 'Multiple themes and custom CSS support for perfect brand matching.',
              },
              {
                title: '📱 Mobile Ready',
                desc: 'Responsive design works perfectly on all devices and screen sizes.',
              },
              {
                title: '🪙 Multi-Token',
                desc: 'Accept payments in DEGEN, PEPE, X4, SHIB, DOGE, USDC, and more memecoins.',
              },
              {
                title: '🔒 Secure',
                desc: 'Non-custodial. Users maintain full control of their funds.',
              },
              {
                title: '⚡ Instant',
                desc: 'Payments settle in < 1 second with real-time confirmations.',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-x4-gold-500 transition-all"
              >
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center bg-gradient-to-r from-x4-gold-500/10 to-yellow-500/10 border border-x4-gold-500/20 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Accept Payments?</h2>
          <p className="text-slate-400 mb-6">
            Create your payment link and start accepting crypto in minutes
          </p>
          <a
            href="/dashboard"
            className="inline-block px-8 py-3 bg-x4-gold-500 hover:bg-x4-gold-600 text-black font-bold rounded-lg transition-all"
          >
            Go to Dashboard →
          </a>
        </div>
      </div>
    </div>
  );
}
