import React from 'react';

interface AnimatedGhostProps {
  position?: 'left' | 'right' | 'center';
  size?: 'small' | 'medium' | 'large';
  delay?: number;
  opacity?: number;
  className?: string;
}

/**
 * Animated Ghost Component
 * Displays the x4 ghost mascot with floating and bobbing animations
 */
export const AnimatedGhost: React.FC<AnimatedGhostProps> = ({
  position = 'center',
  size = 'medium',
  delay = 0,
  opacity = 0.8,
  className = '',
}) => {
  // Size variants
  const sizeClasses = {
    small: 'w-20 h-20',
    medium: 'w-32 h-32',
    large: 'w-48 h-48',
  };

  // Position variants
  const positionClasses = {
    left: 'absolute left-0 top-1/4',
    right: 'absolute right-0 top-1/4',
    center: 'relative',
  };

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes bob {
          0%, 100% {
            transform: translateY(0px);
          }
          25% {
            transform: translateY(-10px);
          }
          75% {
            transform: translateY(10px);
          }
        }

        @keyframes glow {
          0%, 100% {
            filter: drop-shadow(0 0 5px rgba(243, 186, 47, 0.3));
          }
          50% {
            filter: drop-shadow(0 0 20px rgba(243, 186, 47, 0.6));
          }
        }

        @keyframes fadeInOut {
          0% {
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        .ghost-float {
          animation: float 4s ease-in-out infinite;
        }

        .ghost-bob {
          animation: bob 3s ease-in-out infinite;
        }

        .ghost-glow {
          animation: glow 2s ease-in-out infinite;
        }

        .ghost-fade {
          animation: fadeInOut 6s ease-in-out infinite;
        }
      `}</style>

      <div
        className={`${positionClasses[position]} ${className}`}
        style={{
          opacity,
          animationDelay: `${delay}s`,
        }}
      >
        <img
          src="/x4-ghost.png"
          alt="x4 Ghost Mascot"
          className={`${sizeClasses[size]} ghost-float ghost-glow ghost-fade pointer-events-none select-none`}
          style={{
            filter: `drop-shadow(0 0 10px rgba(243, 186, 47, 0.5))`,
          }}
        />
      </div>
    </>
  );
};

export default AnimatedGhost;
