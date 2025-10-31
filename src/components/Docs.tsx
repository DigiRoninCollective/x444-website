import React from 'react';
import { BookOpen, Github, FileText } from 'lucide-react';

const docSections = [
  {
    icon: FileText,
    title: 'API Reference',
    description: 'Complete API documentation for x444 protocol',
    link: '#',
  },
  {
    icon: BookOpen,
    title: 'Integration Guide',
    description: 'Step-by-step guide to integrate x444 into your app',
    link: '#',
  },
  {
    icon: Github,
    title: 'GitHub Repository',
    description: 'Open-source code and examples',
    link: 'https://github.com/zcdos/x444',
  },
];

export default function Docs() {
  return (
    <section id="docs" className="py-20 px-6 bg-gradient-to-b from-dark-800 to-transparent bg-opacity-30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Documentation</span>
          </h2>
          <p className="text-xl text-gray-400">
            Everything you need to get started
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {docSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <a
                key={index}
                href={section.link}
                target={section.link.startsWith('http') ? '_blank' : undefined}
                rel={section.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="card p-8 cursor-pointer hover:shadow-2xl hover:border-cyber-500"
              >
                <Icon className="text-cyber-500 mb-4" size={32} />
                <h3 className="text-xl font-bold mb-2">{section.title}</h3>
                <p className="text-gray-400">{section.description}</p>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
