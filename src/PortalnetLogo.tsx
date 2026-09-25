import React from 'react';

interface PortalnetLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  variant?: 'full' | 'compact' | 'icon';
}

export const PortalnetLogo: React.FC<PortalnetLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  variant = 'full'
}) => {
  const iconSizeMap = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14'
  };

  const iconPxMap = {
    sm: 28,
    md: 36,
    lg: 44,
    xl: 56
  };

  const px = iconPxMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* PortalNet Vector Icon Emblem */}
      <div className={`relative ${iconSizeMap[size]} shrink-0 flex items-center justify-center`}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md"
        >
          <defs>
            {/* Main Portal Gradient */}
            <linearGradient id="portalnet-grad-primary" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="50%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>

            {/* Cyan Fiber Glow Gradient */}
            <linearGradient id="portalnet-grad-fiber" x1="12" y1="8" x2="40" y2="38" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>

            {/* Core Pulse Glow */}
            <radialGradient id="portalnet-core-glow" cx="24" cy="24" r="14" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="40%" stopColor="#38bdf8" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Rounded Shield / Portal Vessel */}
          <rect x="2" y="2" width="44" height="44" rx="12" fill="#0f172a" stroke="#1e293b" strokeWidth="1.5" />

          {/* Outer Optical Ring / Portal Loop */}
          <path
            d="M24 8C15.163 8 8 15.163 8 24C8 32.837 15.163 40 24 40C32.837 40 40 32.837 40 24"
            stroke="url(#portalnet-grad-primary)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* High-speed Optical Stream Swirl (Stylized P & Fiber loop) */}
          <path
            d="M17 35V13C17 13 23 11 29 13C35 15 36 21 33 25C30 29 23 29 23 29H17"
            stroke="url(#portalnet-grad-fiber)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Glowing Optical Fiber Core Nodes */}
          <circle cx="24" cy="24" r="3.5" fill="#38bdf8" />
          <circle cx="24" cy="24" r="1.5" fill="#ffffff" />

          {/* Speed Photons */}
          <circle cx="33" cy="17" r="1.5" fill="#38bdf8" />
          <circle cx="40" cy="24" r="2" fill="#60a5fa" />
          <circle cx="17" cy="35" r="2" fill="#38bdf8" />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center tracking-tight">
            <span className={`${size === 'lg' || size === 'xl' ? 'text-xl font-extrabold' : 'text-base font-bold'} text-slate-100 tracking-wide`}>
              PORTAL
            </span>
            <span className={`${size === 'lg' || size === 'xl' ? 'text-xl font-extrabold' : 'text-base font-bold'} text-sky-400 tracking-wide ml-0.5`}>
              NET
            </span>
            {variant === 'full' && (
              <span className="ml-1.5 px-1.5 py-0.2 rounded text-[9px] font-bold tracking-wider uppercase bg-blue-950/80 text-blue-300 border border-blue-800/60">
                Telecom
              </span>
            )}
          </div>
          <span className="text-[9px] font-medium tracking-[0.16em] uppercase text-slate-400 mt-0.5">
            Engenharia FTTH
          </span>
        </div>
      )}
    </div>
  );
};
