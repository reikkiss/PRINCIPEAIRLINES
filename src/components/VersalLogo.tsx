import React from 'react';

interface VersalLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const VersalLogo: React.FC<VersalLogoProps> = ({ className = '', size = 'md' }) => {
  const sizeMap = {
    sm: 'h-6 text-xl tracking-tight',
    md: 'h-8 text-2xl md:text-3xl tracking-tighter',
    lg: 'h-12 text-4xl md:text-5xl tracking-tighter',
    xl: 'h-20 text-6xl md:text-8xl tracking-tighter',
  };

  return (
    <div className={`font-display select-none inline-flex items-baseline font-black uppercase text-black ${sizeMap[size]} ${className}`}>
      {/* 
        Custom-styled letterforms mimicking Versal's iconic logotype:
        High-contrast strokes, elongated serifs, and interlocking cadence.
      */}
      <span className="inline-block transform scale-y-110">V</span>
      <span className="inline-block transform scale-y-95 -ml-0.5">E</span>
      <span className="inline-block transform scale-y-105 -ml-0.5">R</span>
      <span className="inline-block italic transform scale-y-100 -ml-0.5">S</span>
      <span className="inline-block transform scale-y-110 -ml-0.5">A</span>
      <span className="inline-block transform scale-y-95 -ml-0.5">L</span>
    </div>
  );
};
