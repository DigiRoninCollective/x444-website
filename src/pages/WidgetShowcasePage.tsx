import React, { useState } from 'react';
import { X444PaymentWidget, DARK_THEME, LIGHT_THEME, MINIMAL_THEME } from '../widget';
import { Copy, RotateCcw } from 'lucide-react';

export default function WidgetShowcasePage() {
  const [selectedTheme, setSelectedTheme] = useState<'dark' | 'light' | 'minimal'>('dark');
  const [customColor, setCustomColor] = useState('#F3BA2F');
  const [copiedCode, setCopiedCode] = useState(false);

  const themes = {
    dark: DARK_THEME,
    light: LIGHT_THEME,
    minimal: MINIMAL_THEME,
  };

  const customTheme = {
    primaryColor: customColor,
  };

  const widgetCode = `import { X444PaymentWidget, DARK_THEME } from '@x444/widget';

export default function PaymentPage() {
  return (
    <X444PaymentWidget
      linkId="1"
      contractAddress="0x444444444444444444444444444444444444444444"
      supportedTokens={["0xDEGEN", "0xPEPE", "0xX4"]}
      isGasless={true}
      theme="dark"
      customTheme={{
        primaryColor: "${customColor}"
      }}
      onPaymentSuccess={(txHash, amount) => {
        console.log('Payment successful!', txHash, amount);
      }}
    />
  );
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(widgetCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-20 py-20">
      {/* Header */}
      <section className="px-6 pt-20">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-x4-gold-400 mb-6">
            x444 Widget Showcase
          </h1>
          <p className="text-xl text-x4-silver-400 max-w-3xl">
            Customizable payment widget for your website. Accept memecoins with zero setup.
            Built with X4 branding - fully themeable to match your brand.
          </p>
        </div>
      </section>

      {/* Main Showcase */}
      <section className="px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
          {/* Live Widget */}
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/60 border border-x4-gold-500/20 rounded-xl p-12 flex items-center justify-center min-h-[500px]">
            <X444PaymentWidget
              linkId="demo-1"
              contractAddress="0x444444444444444444444444444444444444444444"
              supportedTokens={['0xDEGEN', '0xPEPE', '0xX4']}
              isGasless={true}
              theme={selectedTheme}
              customTheme={selectedTheme === 'dark' ? customTheme : undefined}
              onPaymentSuccess={(txHash, amount) => {
                console.log('Payment successful!', txHash, amount);
              }}
            />
          </div>

          {/* Configuration */}
          <div className="space-y-8">
            {/* Theme Selection */}
            <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/60 border border-x4-gold-500/20 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-x4-gold-400 mb-6">Theme Selection</h2>
              <div className="space-y-4">
                {(['dark', 'light', 'minimal'] as const).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => setSelectedTheme(theme)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      selectedTheme === theme
                        ? 'border-x4-gold-400 bg-x4-gold-500/10'
                        : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
                    }`}
                  >
                    <p className="font-semibold text-white capitalize">{theme}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {theme === 'dark'
                        ? 'Premium X4 branding with gold accents'
                        : theme === 'light'
                          ? 'Clean white background professional look'
                          : 'Minimal monochrome design'}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Customization */}
            {selectedTheme === 'dark' && (
              <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/60 border border-x4-gold-500/20 rounded-xl p-8">
                <h3 className="text-lg font-bold text-x4-gold-400 mb-4">Customize Primary Color</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input
                      type="color"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      className="w-full h-12 rounded-lg cursor-pointer border border-slate-700"
                    />
                  </div>
                  <div className="font-mono text-sm bg-slate-800 px-4 py-2 rounded-lg">
                    {customColor}
                  </div>
                  <button
                    onClick={() => setCustomColor('#F3BA2F')}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Reset to X4 gold"
                  >
                    <RotateCcw size={20} className="text-x4-gold-400" />
                  </button>
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/60 border border-x4-gold-500/20 rounded-xl p-8">
              <h3 className="text-lg font-bold text-x4-gold-400 mb-6">Features</h3>
              <ul className="space-y-3 text-sm text-x4-silver-400">
                <li className="flex items-start gap-3">
                  <span className="text-x4-gold-400 mt-1">✓</span>
                  <span>Gasless payments - customers sign offline</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-x4-gold-400 mt-1">✓</span>
                  <span>Support for multiple memecoins (DEGEN, PEPE, X4)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-x4-gold-400 mt-1">✓</span>
                  <span>Fully customizable colors and theme</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-x4-gold-400 mt-1">✓</span>
                  <span>Mobile responsive design</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-x4-gold-400 mt-1">✓</span>
                  <span>MetaMask wallet integration</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-x4-gold-400 mt-1">✓</span>
                  <span>Real-time transaction feedback</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/60 border border-x4-gold-500/20 rounded-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-x4-gold-400">Implementation Example</h2>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-4 py-2 bg-x4-gold-500 hover:bg-x4-gold-600 text-black rounded-lg font-semibold transition-colors"
              >
                <Copy size={18} />
                {copiedCode ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
            <pre className="bg-slate-950 p-6 rounded-lg overflow-x-auto text-x4-silver-300 text-sm">
              <code>{widgetCode}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Installation */}
      <section className="px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-slate-900/80 to-slate-900/60 border border-x4-gold-500/20 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-x4-gold-400 mb-6">Installation</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">1. Install Package</h3>
              <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto text-x4-silver-300">
                <code>npm install @x444/widget</code>
              </pre>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">2. Import and Use</h3>
              <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto text-x4-silver-300">
                <code>{`import { X444PaymentWidget } from '@x444/widget';

function App() {
  return (
    <X444PaymentWidget
      linkId="your-link-id"
      contractAddress="your-contract"
      supportedTokens={["0xDEGEN", "0xPEPE"]}
      isGasless={true}
      theme="dark"
    />
  );
}`}</code>
              </pre>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">3. Customize Theme</h3>
              <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto text-x4-silver-300">
                <code>{`<X444PaymentWidget
  ...
  theme="dark"
  customTheme={{
    primaryColor: "#FF6B6B",
    backgroundColor: "#1a1a1a"
  }}
/>`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Theme Presets */}
      <section className="px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-x4-gold-400 mb-12 text-center">Available Themes</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {(['dark', 'light', 'minimal'] as const).map((theme) => {
              const themeConfig = themes[theme];
              return (
                <div
                  key={theme}
                  className="bg-gradient-to-br from-slate-900/80 to-slate-900/60 border border-x4-gold-500/20 rounded-xl p-8"
                >
                  <h3 className="text-xl font-bold text-x4-gold-400 mb-6 capitalize">{theme}</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-slate-500 uppercase mb-2">Primary</p>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg border border-slate-600"
                          style={{ backgroundColor: themeConfig.primaryColor }}
                        />
                        <code className="text-sm text-x4-silver-400">
                          {themeConfig.primaryColor}
                        </code>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase mb-2">Secondary</p>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg border border-slate-600"
                          style={{ backgroundColor: themeConfig.secondaryColor }}
                        />
                        <code className="text-sm text-x4-silver-400">
                          {themeConfig.secondaryColor}
                        </code>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase mb-2">Success</p>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg border border-slate-600"
                          style={{ backgroundColor: themeConfig.successColor }}
                        />
                        <code className="text-sm text-x4-silver-400">
                          {themeConfig.successColor}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
