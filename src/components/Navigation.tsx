import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Protocol', href: '/protocol' },
    { label: 'Technical', href: '/technical' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Analytics', href: '/analytics' },
    { label: 'Docs', href: '/docs' },
    { label: 'CZDOS', href: '/czdos' },
    { label: 'GitHub', href: 'https://github.com/zcdos/x4', target: '_blank' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-x4-gold-500/20 bg-x4-black-900 bg-opacity-95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <picture>
            <img src="/x4-logo-nav.jpg" alt="x4 - HTTP 402 Layer Protocol" className="h-12 w-12 rounded-lg shadow-lg" />
          </picture>
          <span className="text-lg font-bold text-x4-gold-500 hidden sm:inline">x4</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8">
          {navLinks.map((link) => {
            const isExternal = link.href.startsWith('http');
            const Component = isExternal ? 'a' : Link;
            const props = isExternal
              ? { href: link.href, target: '_blank', rel: 'noopener noreferrer' }
              : { to: link.href };

            const isActive = location.pathname === link.href;

            return (
              <Component
                key={link.label}
                {...props}
                className={`text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-x4-gold-400 border-b-2 border-x4-gold-400 pb-1'
                    : 'text-x4-silver-400 hover:text-x4-gold-500'
                }`}
              >
                {link.label}
              </Component>
            );
          })}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-x4-silver-400 hover:text-x4-gold-500 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-x4-gold-500/20 bg-x4-black-800">
          <div className="px-6 py-4 space-y-4">
            {navLinks.map((link) => {
              const isExternal = link.href.startsWith('http');
              const Component = isExternal ? 'a' : Link;
              const props = isExternal
                ? { href: link.href, target: '_blank', rel: 'noopener noreferrer' }
                : { to: link.href };

              const isActive = location.pathname === link.href;

              return (
                <Component
                  key={link.label}
                  {...props}
                  className={`block text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-x4-gold-400 pl-2 border-l-2 border-x4-gold-400'
                      : 'text-x4-silver-400 hover:text-x4-gold-500'
                  }`}
                >
                  {link.label}
                </Component>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
