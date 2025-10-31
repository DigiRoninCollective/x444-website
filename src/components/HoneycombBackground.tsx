import React, { useMemo } from 'react';

export default function HoneycombBackground() {
  const createHoneycomb = () => {
    const hexagons = [];
    const size = 40;
    const spacing = size * 1.8;
    const centerX = 700;
    const centerY = 500;
    const activationRadius = 400;

    // Reduce hexagon count by 60% for performance
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 10; col++) {
        const x = col * spacing + (row % 2) * (spacing / 2);
        const y = row * spacing * 0.75;
        const points = [];

        for (let i = 0; i < 6; i++) {
          const angle = (i * 60 * Math.PI) / 180;
          const px = x + size * Math.cos(angle);
          const py = y + size * Math.sin(angle);
          points.push([px, py]);
        }

        // Pre-compute activation state
        const distance = Math.hypot(x - centerX, y - centerY);
        const shouldActivate = distance < activationRadius;

        hexagons.push({
          id: `hex-${row}-${col}`,
          points: points.map(p => p.join(',')).join(' '),
          x,
          y,
          shouldActivate,
        });
      }
    }
    return hexagons;
  };

  // Generate animated particle paths - reduced for performance
  const generateParticlePaths = () => {
    const paths = [];
    const centerX = 700;
    const centerY = 500;

    // Reduce particle paths from 8 to 4
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI * 2) / 4;
      const radius = 300 + (i % 2) * 150;
      const endX = centerX + Math.cos(angle) * radius;
      const endY = centerY + Math.sin(angle) * radius;

      // Add intermediate points for organic curves
      const midX = centerX + Math.cos(angle + 0.3) * (radius * 0.6);
      const midY = centerY + Math.sin(angle + 0.3) * (radius * 0.6);

      paths.push({
        id: `particle-path-${i}`,
        d: `M ${centerX} ${centerY} Q ${midX} ${midY} ${endX} ${endY}`,
        duration: 5,
        delay: i * 1.25,
      });
    }
    return paths;
  };

  const honeycombCells = useMemo(() => createHoneycomb(), []);
  const particlePaths = useMemo(() => generateParticlePaths(), []);

  return (
    <svg className="honeycomb-bg" viewBox="0 0 1400 1000" preserveAspectRatio="xMidYMid slice">
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        <style>{`
          @keyframes blockchain-pulse-strong {
            0% {
              r: 3px;
              opacity: 1;
            }
            100% {
              r: 20px;
              opacity: 0;
            }
          }

          @keyframes particle-float {
            0% {
              offset-distance: 0%;
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% {
              offset-distance: 100%;
              opacity: 0;
            }
          }

          @keyframes cell-activate {
            0%, 100% {
              stroke: rgba(244, 184, 26, 0.2);
            }
            50% {
              stroke: rgba(244, 184, 26, 0.4);
            }
          }

          .pulse-node {
            animation: blockchain-pulse-strong 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            fill: rgba(244, 184, 26, 1);
          }

          .pulse-node-1 { animation-delay: 0s; }
          .pulse-node-2 { animation-delay: 0.5s; }
          .pulse-node-3 { animation-delay: 1s; }
          .pulse-node-4 { animation-delay: 1.5s; }

          .signal-dot {
            fill: rgba(244, 184, 26, 1);
          }

          .particle-float {
            animation: particle-float linear infinite;
            fill: rgba(244, 184, 26, 0.8);
          }

          .honeycomb-cell-active {
            animation: cell-activate 4s ease-in-out infinite;
          }

          .background-shimmer {
            opacity: 0.2;
          }
        `}</style>
      </defs>

      {/* Honeycomb cells with activation */}
      <g className="honeycomb-cells">
        {honeycombCells.map((hex) => (
          <polygon
            key={hex.id}
            points={hex.points}
            className={hex.shouldActivate ? 'honeycomb-cell-active' : 'honeycomb-cell'}
            stroke="rgba(244, 184, 26, 0.2)"
            strokeWidth="1.5"
            fill="none"
          />
        ))}
      </g>

      {/* Blockchain pulse nodes - reduced for performance */}
      <g className="pulse-nodes">
        {/* Top-left node only */}
        <circle cx="250" cy="200" r="2" className="pulse-node pulse-node-1" fill="rgba(244, 184, 26, 1)" />

        {/* Center node only */}
        <circle cx="700" cy="500" r="2" className="pulse-node pulse-node-2" fill="rgba(244, 184, 26, 1)" />

        {/* Bottom-right node only */}
        <circle cx="1150" cy="800" r="2" className="pulse-node pulse-node-3" fill="rgba(244, 184, 26, 1)" />
      </g>

      {/* Signal flow paths - simplified */}
      <g className="signal-paths">
        {/* Path 1: Top-left to center */}
        <path
          d="M 250 200 L 700 500"
          stroke="rgba(244, 184, 26, 0.3)"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />

        {/* Path 2: Center to bottom-right */}
        <path
          d="M 700 500 L 1150 800"
          stroke="rgba(244, 184, 26, 0.3)"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />

        {/* Path 3: Bottom-right back to top-left */}
        <path
          d="M 1150 800 L 250 200"
          stroke="rgba(244, 184, 26, 0.3)"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />
      </g>

      {/* Flowing particle animation paths */}
      <g className="flowing-particles">
        {particlePaths.map((path, idx) => (
          <g key={path.id}>
            <path
              id={path.id}
              d={path.d}
              fill="none"
              stroke="none"
            />
            {/* Particle traveling on the path */}
            <circle cx="0" cy="0" r="5" className="particle-float" style={{
              animationDuration: `${path.duration}s`,
              animationDelay: `${path.delay}s`,
            }}>
              <animateMotion
                dur={`${path.duration}s`}
                begin={`${path.delay}s`}
                repeatCount="indefinite"
              >
                <mpath href={`#${path.id}`} />
              </animateMotion>
            </circle>
          </g>
        ))}
      </g>

      {/* Subtle static outer glow effect */}
      <circle
        cx="700"
        cy="500"
        r="450"
        fill="none"
        stroke="rgba(244, 184, 26, 0.08)"
        strokeWidth="1"
      />

      {/* Path definitions for animateMotion */}
      <defs>
        <path id="path1" d="M 250 200 L 700 500" />
        <path id="path2" d="M 700 500 L 1150 800" />
        <path id="path3" d="M 1150 800 L 250 200" />
      </defs>
    </svg>
  );
}
