import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Crown, Heart, Plane, Sparkles } from 'lucide-react';

interface HeroStickersProps {
  onScrollToSection?: (sectionId: string) => void;
}

export const HeroStickers: React.FC<HeroStickersProps> = ({ onScrollToSection }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-30"
      aria-hidden="true"
    >
      {/* 
        STICKER 1 (Left): Organic Scalloped Wavy Die-Cut Menu Shape in Warm Terracotta
        Directly matches the wavy menu cards in image.png left panel ("YOU DESERVE A LOVE THAT ALWAYS FEELS LIKE SUMMER")
      */}
      <motion.div
        drag
        dragConstraints={containerRef}
        dragElastic={0.2}
        whileHover={{ scale: 1.06, rotate: -3 }}
        whileTap={{ scale: 0.95 }}
        className="absolute top-[5%] left-[2%] sm:left-[4%] lg:left-[6%] pointer-events-auto cursor-grab active:cursor-grabbing z-20"
        initial={{ opacity: 0, y: -20, rotate: -6 }}
        animate={{ opacity: 1, y: 0, rotate: -4 }}
        transition={{ duration: 0.8, delay: 0.1, type: 'spring', stiffness: 120 }}
      >
        <button
          type="button"
          onClick={() => onScrollToSection?.('letters-registry')}
          className="relative w-44 sm:w-56 text-left drop-shadow-xl focus:outline-none group transform"
          title="Ver Cartas de Amor"
        >
          {/* SVG Scalloped Wavy Shape matching left panel of image.png */}
          <div className="relative">
            <svg viewBox="0 0 220 140" className="w-full h-auto text-[#E05A36] group-hover:text-[#D44E2A] transition-colors filter drop-shadow-md">
              <path
                d="M 20,10 
                   Q 35,0 55,10 
                   Q 75,0 95,10 
                   Q 115,0 135,10 
                   Q 155,0 175,10 
                   Q 195,0 205,15
                   Q 215,30 205,45
                   Q 215,60 205,75
                   Q 215,90 205,105
                   Q 215,120 205,130
                   Q 185,140 165,130
                   Q 145,140 125,130
                   Q 105,140 85,130
                   Q 65,140 45,130
                   Q 25,140 15,125
                   Q 5,110 15,95
                   Q 5,80 15,65
                   Q 5,50 15,35
                   Q 5,20 20,10 Z"
                fill="currentColor"
              />
            </svg>

            {/* Content inside the wavy shape */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-[#FFF6F2]">
              <div className="flex items-center gap-1 text-[8px] sm:text-[9px] font-mono tracking-widest uppercase opacity-90 mb-1">
                <Crown className="w-3 h-3 text-amber-300 fill-amber-300" />
                <span>PRINCIPE AIRLINES</span>
              </div>
              <p className="font-display font-black text-xs sm:text-sm tracking-tight uppercase leading-tight max-w-[170px]">
                YOU DESERVE A LOVE THAT ALWAYS FEELS LIKE SUMMER
              </p>
              <span className="font-script text-base sm:text-lg text-amber-200 mt-0.5">
                Para mi Novio · Siempre
              </span>
            </div>
          </div>
        </button>
      </motion.div>

      {/* 
        STICKER 2 (Top Right): Roman Arch Card in Marigold Candy Stripes
        Matches middle & right panels ("CANELLE & BENJAMIN", "MILA & THEO", "SAVE THE DATE")
      */}
      <motion.div
        drag
        dragConstraints={containerRef}
        dragElastic={0.2}
        whileHover={{ scale: 1.06, rotate: 4 }}
        whileTap={{ scale: 0.95 }}
        className="absolute top-[6%] right-[2%] sm:right-[4%] lg:right-[6%] pointer-events-auto cursor-grab active:cursor-grabbing z-20 scale-[0.6] sm:scale-100"
        initial={{ opacity: 0, scale: 0.8, rotate: 6 }}
        animate={{ opacity: 1, scale: 1, rotate: 4 }}
        transition={{ duration: 0.8, delay: 0.2, type: 'spring' }}
      >
        <button
          type="button"
          onClick={() => onScrollToSection?.('tickets-3d')}
          className="relative w-40 sm:w-48 bg-[#FAF6EE] text-[#0E2340] p-4 pb-6 shape-arch shadow-2xl border-2 border-amber-300/60 focus:outline-none group text-center transform hover:rotate-2 transition-transform"
          title="Ver Boletos de Vuelo 3D"
        >
          {/* Top Marigold Candy Stripes accent bar */}
          <div className="w-16 h-3 mx-auto mb-3 rounded-full pattern-stripes-marigold border border-amber-400/40" />

          {/* Roman Arch Crown Emblem */}
          <div className="w-10 h-10 mx-auto rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-2 border border-amber-300 shadow-xs">
            <Crown className="w-5 h-5 fill-amber-400 text-amber-600 animate-pulse" />
          </div>

          <p className="text-[8px] sm:text-[9px] font-mono tracking-widest text-[#E05A36] uppercase font-bold">
            SPECIAL CLASS
          </p>
          <h4 className="font-display font-black text-base sm:text-lg tracking-tight text-[#0E2340] leading-none mt-1">
            TÚ & YO
          </h4>
          <span className="font-script text-xl sm:text-2xl text-[#E05A36] block -mt-1">
            Por Siempre
          </span>
          <div className="mt-2 pt-2 border-t border-amber-200/80 flex items-center justify-center gap-1.5 text-[8px] font-mono text-neutral-500">
            <Plane className="w-3 h-3 text-[#E05A36]" />
            <span>CHI-2026 · DESTINO FELIZ</span>
          </div>
        </button>
      </motion.div>

      {/* 
        STICKER 3 (Bottom Left): Mediterranean Navy & Cream Checkered Tag
        Matches the navy/cream checkerboard pattern on the right panel of image.png
      */}
      <motion.div
        drag
        dragConstraints={containerRef}
        dragElastic={0.2}
        whileHover={{ scale: 1.08, rotate: -4 }}
        whileTap={{ scale: 0.95 }}
        className="absolute bottom-[10%] left-[2%] sm:left-[4%] lg:left-[7%] pointer-events-auto cursor-grab active:cursor-grabbing z-20 scale-[0.6] sm:scale-100"
        initial={{ opacity: 0, x: -20, rotate: 8 }}
        animate={{ opacity: 1, x: 0, rotate: 4 }}
        transition={{ duration: 0.8, delay: 0.3, type: 'spring' }}
      >
        <button
          type="button"
          onClick={() => onScrollToSection?.('flight-map')}
          className="relative w-44 rounded-2xl overflow-hidden shadow-2xl border-2 border-white focus:outline-none group text-left transform"
          title="Ver Mapa Mundial de Destinos"
        >
          {/* Top Checkered Pattern Header */}
          <div className="h-9 w-full pattern-checkers-navy border-b border-[#0E2340]/20" />
          
          <div className="bg-[#0E2340] p-3 text-white">
            <div className="flex items-center justify-between pb-1.5 border-b border-white/15">
              <span className="font-mono text-[9px] font-bold text-amber-300 tracking-wider">BOARDING PASS</span>
              <Heart className="w-3.5 h-3.5 fill-[#FA8B69] text-[#FA8B69]" />
            </div>
            <p className="font-mono text-[8px] text-white/70 uppercase mt-1">PASAJERO VIP:</p>
            <p className="font-display font-black text-xs uppercase tracking-tight text-white">EL REY DE MI VIDA</p>
            <p className="font-mono text-[8px] text-amber-200 mt-1 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-amber-300" />
              <span>VUELO DE AMOR CONTINUO</span>
            </p>
          </div>
        </button>
      </motion.div>

      {/* 
        STICKER 4 (Bottom Right): Dried Orange Slice & Heart Cutout Tag
        Matches the dried orange slices and terracotta heart tags in image.png
      */}
      <motion.div
        drag
        dragConstraints={containerRef}
        dragElastic={0.2}
        whileHover={{ scale: 1.08, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        className="absolute bottom-[10%] right-[3%] sm:right-[5%] lg:right-[8%] pointer-events-auto cursor-grab active:cursor-grabbing z-20 scale-[0.6] sm:scale-100"
        initial={{ opacity: 0, y: 20, rotate: -6 }}
        animate={{ opacity: 1, y: 0, rotate: -3 }}
        transition={{ duration: 0.8, delay: 0.35, type: 'spring' }}
      >
        <button
          type="button"
          onClick={() => onScrollToSection?.('letters-registry')}
          className="relative flex items-center gap-2 p-2 bg-[#FAF6EE] rounded-full shadow-xl border border-amber-300/80 group focus:outline-none cursor-pointer transform hover:scale-105 transition-all"
          title="Cartas de Amor"
        >
          {/* Realistic dried citrus illustration */}
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-0.5 shadow-inner flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-amber-500/90 border border-amber-300/60 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle,#FDE047_10%,transparent_60%)]" />
              <Crown className="w-5 h-5 text-amber-100 fill-amber-100/40" />
            </div>
          </div>

          <div className="text-left font-mono pr-3">
            <p className="text-[10px] font-black text-[#E05A36] uppercase tracking-wider leading-none">100% AMOR</p>
            <p className="text-[8px] text-[#0E2340] tracking-wide mt-0.5">RAUL & REIKIS</p>
          </div>
        </button>
      </motion.div>
    </div>
  );
};
