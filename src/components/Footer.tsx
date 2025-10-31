import React from 'react';
import { Github, Twitter, Mail, ExternalLink } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = {
    'Documentation': [
      { label: 'API Reference', href: '#' },
      { label: 'Integration Guide', href: '#' },
      { label: 'GitHub', href: 'https://github.com/zcdos/x4' },
    ],
    'Community': [
      { label: 'Discord', href: '#' },
      { label: 'Twitter', href: '#' },
      { label: 'GitHub Issues', href: '#' },
    ],
    'Protocol': [
      { label: 'Whitepaper', href: '#' },
      { label: 'Security', href: '#' },
      { label: 'Audit', href: '#' },
    ],
  };

  const social = [
    { icon: Github, href: 'https://github.com/zcdos/x4', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Mail, href: 'mailto:dev@x4.io', label: 'Email' },
  ];

  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Footer Grid */}
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <picture>
              <source srcSet="/x4.webp" type="image/webp" />
              <img src="/x4.jpg" alt="x4" className="h-10 w-10 rounded mb-4" />
            </picture>
            <h3 className="text-lg font-semibold text-white mb-2">x4 Protocol</h3>
            <p className="text-slate-400 text-sm mb-6">
              Open-source HTTP 402 payment protocol for the modern web.
            </p>
            <div className="flex gap-4">
              {social.map((link, index) => {
                const Icon = link.icon;
                return (
                  <a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-x4-gold-500 transition-colors"
                    title={link.label}
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h3 className="font-semibold text-white mb-4">{category}</h3>
              <ul className="space-y-2">
                {items.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-slate-400 hover:text-x4-gold-500 text-sm flex items-center gap-2 transition-colors"
                    >
                      {link.label}
                      {link.href.startsWith('http') && <ExternalLink size={14} />}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            © {currentYear} x4 Protocol. MIT License.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-x4-gold-500 text-sm">Privacy</a>
            <a href="#" className="text-slate-400 hover:text-x4-gold-500 text-sm">Terms</a>
            <a href="#" className="text-slate-400 hover:text-x4-gold-500 text-sm">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
