import React, { useRef } from 'react';
import { motion } from 'motion/react';

interface HeroStickersProps {
  onSelectProject?: (projectId: string) => void;
  language?: 'es' | 'en';
}

export const HeroStickers: React.FC<HeroStickersProps> = ({ onSelectProject, language = 'es' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 
        STICKER 1: Top-Left Tilted B&W Oval Cutout 
        In screenshot: Oval shaped graphic showing monochrome floral / abstract patterns
      */}
      <motion.div
        drag
        dragConstraints={containerRef}
        dragElastic={0.2}
        whileHover={{ scale: 1.08, rotate: -8 }}
        whileTap={{ scale: 0.96 }}
        className="absolute top-[8%] left-[4%] sm:left-[8%] lg:left-[12%] pointer-events-auto cursor-grab active:cursor-grabbing z-10"
        initial={{ opacity: 0, y: -20, rotate: -15 }}
        animate={{ opacity: 1, y: 0, rotate: -12 }}
        transition={{ duration: 0.8, delay: 0.1, type: 'spring', stiffness: 120 }}
      >
        <div 
          onClick={() => onSelectProject?.('cerveza-2-monos')}
          className="relative w-24 h-16 sm:w-32 sm:h-20 lg:w-36 lg:h-24 rounded-[50%] overflow-hidden shadow-xl border border-black/10 bg-black group"
          title="Ver Cerveza 2 Monos"
        >
          {/* Black and white graphic pattern inside oval */}
          <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center p-2">
            <svg viewBox="0 0 100 60" className="w-full h-full text-white/90">
              <rect width="100" height="60" fill="#18181b" />
              <line x1="0" y1="0" x2="100" y2="60" stroke="#ffffff" strokeWidth="4" />
              <line x1="20" y1="0" x2="100" y2="40" stroke="#ffffff" strokeWidth="2" />
              <line x1="0" y1="20" x2="80" y2="60" stroke="#ffffff" strokeWidth="2" />
              {/* White floral halftone pattern */}
              <g fill="#fafafa" opacity="0.85">
                <circle cx="35" cy="30" r="10" />
                <circle cx="28" cy="22" r="5" />
                <circle cx="42" cy="22" r="5" />
                <circle cx="28" cy="38" r="5" />
                <circle cx="42" cy="38" r="5" />
                <circle cx="70" cy="25" r="8" fill="#e4e4e7" />
                <circle cx="15" cy="45" r="6" fill="#a1a1aa" />
              </g>
            </svg>
          </div>
          <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/20 pointer-events-none" />
        </div>
      </motion.div>

      {/* 
        STICKER 2: Top-Left Scalloped Hot Pink Badge "CERVEZA 2 MONOS"
        In screenshot: Bright magenta wavy scalloped circular badge with monkey and circular brand text
      */}
      <motion.div
        drag
        dragConstraints={containerRef}
        dragElastic={0.25}
        whileHover={{ scale: 1.08, rotate: 6 }}
        whileTap={{ scale: 0.95 }}
        className="absolute top-[10%] left-[20%] sm:left-[24%] lg:left-[22%] pointer-events-auto cursor-grab active:cursor-grabbing z-20"
        initial={{ opacity: 0, scale: 0.8, rotate: -4 }}
        animate={{ opacity: 1, scale: 1, rotate: 2 }}
        transition={{ duration: 0.8, delay: 0.2, type: 'spring', stiffness: 140 }}
      >
        <button
          type="button"
          onClick={() => onSelectProject?.('cerveza-2-monos')}
          className="relative w-32 h-32 sm:w-44 sm:h-44 lg:w-52 lg:h-52 flex items-center justify-center drop-shadow-2xl focus:outline-none group text-left"
          title="Cerveza 2 Monos — Craft Packaging"
        >
          {/* SVG Scalloped / Wavy Shape */}
          <svg viewBox="0 0 200 200" className="w-full h-full text-[#FF007F] group-hover:text-[#FF1493] transition-colors filter drop-shadow-md">
            <path
              d="M 100,5 
                 C 114,6 122,17 132,15 
                 C 145,13 151,28 160,31 
                 C 171,35 174,51 180,59 
                 C 188,70 186,86 188,97 
                 C 190,111 182,126 179,137 
                 C 174,150 160,158 150,167 
                 C 139,176 126,183 112,187 
                 C 97,190 85,183 71,183 
                 C 57,183 45,172 35,162 
                 C 25,152 17,137 14,123 
                 C 11,108 17,94 17,79 
                 C 17,64 25,51 34,42 
                 C 45,31 60,25 73,18 
                 C 84,11 91,4 100,5 Z"
              fill="currentColor"
            />
          </svg>

          {/* Badge interior content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white">
            {/* Monkey graphic illustration + circular text */}
            <div className="relative w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full border-2 border-white/60 flex flex-col items-center justify-center p-1 bg-white/10 backdrop-blur-[1px]">
              {/* Circular Top Text */}
              <span className="text-[7px] sm:text-[9px] lg:text-[10px] font-black tracking-widest uppercase text-white/95 text-center leading-none">
                CERVEZA 2 MONOS
              </span>
              
              {/* Twin Monkeys Stylized Icon */}
              <div className="my-0.5 sm:my-1 flex items-center justify-center gap-1">
                <svg viewBox="0 0 40 40" className="w-8 h-8 sm:w-12 sm:h-12 text-white fill-current">
                  {/* Monkey face left */}
                  <circle cx="16" cy="18" r="9" fill="white" />
                  <circle cx="8" cy="15" r="3.5" fill="white" />
                  <circle cx="24" cy="15" r="3.5" fill="white" />
                  <ellipse cx="16" cy="20" rx="6" ry="5" fill="#FF007F" />
                  <circle cx="13" cy="18" r="1.5" fill="white" />
                  <circle cx="19" cy="18" r="1.5" fill="white" />
                  <path d="M 13,22 Q 16,25 19,22" stroke="white" strokeWidth="1.2" fill="none" />
                  {/* Second Monkey head leaning right */}
                  <circle cx="26" cy="22" r="7" fill="white" />
                  <circle cx="32" cy="20" r="2.8" fill="white" />
                  <ellipse cx="26" cy="24" rx="4.5" ry="3.8" fill="#FF007F" />
                  <circle cx="24" cy="22" r="1.2" fill="white" />
                  <circle cx="28" cy="22" r="1.2" fill="white" />
                </svg>
              </div>

              <span className="text-[6px] sm:text-[7px] lg:text-[8px] font-bold tracking-widest text-white/80 uppercase">
                STGO · CHILE
              </span>
            </div>
          </div>
        </button>
      </motion.div>

      {/* 
        STICKER 3: Top-Right Circular Cutout (B Framed Art Poster against Corrugated Metal)
        In screenshot: Circular black & white photo showing framed artwork leaning on wall
      */}
      <motion.div
        drag
        dragConstraints={containerRef}
        dragElastic={0.2}
        whileHover={{ scale: 1.08, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        className="absolute top-[8%] right-[4%] sm:right-[8%] lg:right-[15%] pointer-events-auto cursor-grab active:cursor-grabbing z-15"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.25, type: 'spring' }}
      >
        <div 
          onClick={() => onSelectProject?.('boheme-spirits')}
          className="relative w-28 h-28 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden shadow-2xl border-2 border-black/15 bg-neutral-900 group"
          title="Ver Boheme Spirits & Packaging"
        >
          {/* Architectural B&W Scene */}
          <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center overflow-hidden">
            {/* Corrugated background stripes */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,#262626,#262626_6px,#171717_6px,#171717_12px)] opacity-60" />
            
            {/* Leaning Framed Poster with "B" */}
            <div className="relative w-16 h-20 sm:w-20 sm:h-28 bg-neutral-950 border border-white/20 rounded shadow-2xl flex flex-col items-center justify-center transform -rotate-6 transition-transform group-hover:rotate-0">
              <span className="font-display text-4xl sm:text-5xl font-black text-white/90 italic tracking-tighter">
                B
              </span>
              <span className="text-[6px] sm:text-[8px] tracking-widest uppercase font-mono text-neutral-400 mt-1">
                VERSAL
              </span>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/10 pointer-events-none" />
        </div>
      </motion.div>

      {/* 
        STICKER 4: Middle-Right Pink Ticket with Red Illustrated Lounging Figure
        In screenshot: Ticket with circular notches on top and bottom, blush pink background, red print
      */}
      <motion.div
        drag
        dragConstraints={containerRef}
        dragElastic={0.2}
        whileHover={{ scale: 1.08, rotate: -4 }}
        whileTap={{ scale: 0.95 }}
        className="absolute top-[42%] right-[2%] sm:right-[6%] lg:right-[8%] pointer-events-auto cursor-grab active:cursor-grabbing z-20"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3, type: 'spring' }}
      >
        <button
          type="button"
          onClick={() => onSelectProject?.('cool-girls-run')}
          className="relative w-36 h-20 sm:w-52 sm:h-28 lg:w-60 lg:h-32 drop-shadow-xl focus:outline-none group text-left"
          title="Cool Girls Run & Apparel"
        >
          <svg viewBox="0 0 200 110" className="w-full h-full text-[#FDE2E4] group-hover:text-[#FCD5D8] transition-colors filter drop-shadow-md">
            {/* Ticket shape with half-circle notch at top-middle and bottom-middle */}
            <path
              d="M 10,0 
                 L 85,0 
                 A 15,15 0 0,0 115,0 
                 L 190,0 
                 A 10,10 0 0,1 200,10 
                 L 200,100 
                 A 10,10 0 0,1 190,110 
                 L 115,110 
                 A 15,15 0 0,0 85,110 
                 L 10,110 
                 A 10,10 0 0,1 0,100 
                 L 0,10 
                 A 10,10 0 0,1 10,0 Z"
              fill="currentColor"
            />
          </svg>

          {/* Ticket graphics: relaxed figure with leopard shirt */}
          <div className="absolute inset-0 flex items-center justify-center p-3">
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Silhouette Illustration in Crimson Coral */}
              <svg viewBox="0 0 140 70" className="w-full h-full text-[#E63946] fill-current">
                {/* Person lying horizontally propped on arms */}
                <circle cx="30" cy="30" r="10" /> {/* Head */}
                {/* Torso in t-shirt */}
                <path d="M 38,32 L 85,36 L 82,52 L 40,48 Z" />
                {/* Legs extended back */}
                <path d="M 85,36 L 115,44 L 126,38 L 128,45 L 110,50 L 82,52 Z" />
                {/* Arms supporting */}
                <path d="M 40,40 L 46,58 L 52,58 L 48,42 Z" />
                
                {/* Leopard / cat print on t-shirt */}
                <g fill="#FDE2E4">
                  <path d="M 52,38 Q 62,36 70,42 Q 62,48 54,44 Z" />
                  <circle cx="56" cy="40" r="1.5" />
                  <circle cx="64" cy="42" r="1.5" />
                  <circle cx="60" cy="46" r="1.2" />
                </g>
              </svg>
            </div>
          </div>
        </button>
      </motion.div>

      {/* 
        STICKER 5: Bottom-Left Scalloped Starburst Seal (Warm Glowing Shopfront with "B")
        In screenshot: Chartreuse/olive gold notched scalloped badge with warm illuminated storefront "B"
      */}
      <motion.div
        drag
        dragConstraints={containerRef}
        dragElastic={0.2}
        whileHover={{ scale: 1.08, rotate: -6 }}
        whileTap={{ scale: 0.95 }}
        className="absolute bottom-[10%] left-[8%] sm:left-[10%] lg:left-[14%] pointer-events-auto cursor-grab active:cursor-grabbing z-20"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.35, type: 'spring' }}
      >
        <button
          type="button"
          onClick={() => onSelectProject?.('gow-art-tools')}
          className="relative w-32 h-32 sm:w-44 sm:h-44 lg:w-48 lg:h-48 drop-shadow-2xl focus:outline-none group text-left"
          title="Ver Gow & Retail Spaces"
        >
          {/* SVG 16-point scalloped starburst in Chartreuse Yellow-Olive */}
          <svg viewBox="0 0 200 200" className="w-full h-full text-[#B8AA18] group-hover:text-[#C5B71A] transition-colors filter drop-shadow-lg">
            <path
              d="M 100,5 
                 L 118,22 L 142,12 L 153,34 L 178,32 L 181,57 L 200,68 L 193,93 L 200,118 L 181,130 L 178,155 L 153,153 L 142,176 L 118,166 L 100,183 
                 L 82,166 L 58,176 L 47,153 L 22,155 L 19,130 L 0,118 L 7,93 L 0,68 L 19,57 L 22,32 L 47,34 L 58,12 L 82,22 Z"
              fill="currentColor"
            />
          </svg>

          {/* Shopfront cutout inside badge */}
          <div className="absolute inset-4 rounded-xl overflow-hidden bg-black flex items-center justify-center border border-white/20">
            {/* Illuminated yellow storefront window */}
            <div className="relative w-full h-full bg-[#EAB308] p-2 flex flex-col items-center justify-center text-center">
              <div className="w-full h-full bg-neutral-900/90 border border-yellow-400/40 p-2 flex flex-col items-center justify-center">
                <span className="font-display font-black text-2xl sm:text-3xl text-yellow-400 italic">
                  B
                </span>
                <span className="text-[6px] sm:text-[7px] text-yellow-100 font-mono tracking-tight uppercase leading-tight mt-1">
                  NO ACEPTAMOS<br />LO ORDINARIO
                </span>
              </div>
            </div>
          </div>
        </button>
      </motion.div>

      {/* 
        STICKER 6: Bottom-Right Circular Monochrome Cutout (Hand Holding Craft Beer Glass)
        In screenshot: Circular grayscale photograph of hand holding cold branded tumbler
      */}
      <motion.div
        drag
        dragConstraints={containerRef}
        dragElastic={0.2}
        whileHover={{ scale: 1.08, rotate: 4 }}
        whileTap={{ scale: 0.95 }}
        className="absolute bottom-[8%] right-[16%] sm:right-[18%] lg:right-[20%] pointer-events-auto cursor-grab active:cursor-grabbing z-15"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4, type: 'spring' }}
      >
        <div 
          onClick={() => onSelectProject?.('cerveza-2-monos')}
          className="relative w-28 h-28 sm:w-36 sm:h-36 lg:w-44 lg:h-44 rounded-full overflow-hidden shadow-2xl border-2 border-black/15 bg-neutral-900 group"
          title="Cerveza 2 Monos Cristalería"
        >
          {/* Grayscale hand & tumbler graphic */}
          <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full text-neutral-300">
              <rect width="100" height="100" fill="#27272a" />
              {/* Hand silhouette holding glass */}
              <path d="M 0,70 Q 25,60 45,65 L 48,72 L 40,85 L 0,85 Z" fill="#52525b" />
              {/* Tumbler Glass */}
              <polygon points="50,40 75,38 70,88 55,88" fill="#18181b" stroke="#a1a1aa" strokeWidth="1.5" />
              {/* Foam on top */}
              <path d="M 50,40 Q 62,35 75,38 L 74,48 Q 62,45 50,48 Z" fill="#f4f4f5" />
              {/* Beer liquid with dark porter / stout gradient */}
              <polygon points="51,48 74,48 70,86 55,86" fill="#09090b" />
              {/* Circular badge on glass */}
              <circle cx="62" cy="65" r="7" fill="white" />
              <circle cx="62" cy="65" r="5" fill="#18181b" />
            </svg>
          </div>
          <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10 pointer-events-none" />
        </div>
      </motion.div>

      {/* 
        STICKER 7: Bottom-Right Jagged Cobalt Blue Starburst Seal ("2 MONOS")
        In screenshot: Deep royal cobalt blue jagged seal with "2 MONOS" can graphics, overlapping the hand
      */}
      <motion.div
        drag
        dragConstraints={containerRef}
        dragElastic={0.25}
        whileHover={{ scale: 1.1, rotate: -8 }}
        whileTap={{ scale: 0.95 }}
        className="absolute bottom-[14%] right-[4%] sm:right-[8%] lg:right-[10%] pointer-events-auto cursor-grab active:cursor-grabbing z-25"
        initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
        animate={{ opacity: 1, scale: 1, rotate: 12 }}
        transition={{ duration: 0.8, delay: 0.45, type: 'spring', stiffness: 150 }}
      >
        <button
          type="button"
          onClick={() => onSelectProject?.('cerveza-2-monos')}
          className="relative w-28 h-28 sm:w-36 sm:h-36 lg:w-44 lg:h-44 drop-shadow-2xl focus:outline-none group text-left"
          title="Cerveza 2 Monos — Ver Proyecto"
        >
          {/* 24-point sharp starburst in intense electric cobalt blue */}
          <svg viewBox="0 0 200 200" className="w-full h-full text-[#0015ff] group-hover:text-[#0022ff] transition-colors filter drop-shadow-xl">
            <path
              d="M 100,0 
                 L 113,26 L 138,10 L 145,38 L 173,31 L 170,60 L 198,63 L 185,90 L 200,105 L 180,123 L 194,146 L 168,155 L 171,184 L 144,181 L 137,200 L 112,189 L 100,200 
                 L 88,189 L 63,200 L 56,181 L 29,184 L 32,155 L 6,146 L 20,123 L 0,105 L 15,90 L 2,63 L 30,60 L 27,31 L 55,38 L 62,10 L 87,26 Z"
              fill="currentColor"
            />
          </svg>

          {/* Interior angled typography */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-white transform -rotate-12">
            <span className="text-[7px] sm:text-[9px] font-mono tracking-widest text-white/75 uppercase">
              CERVEZA
            </span>
            <span className="font-display font-black text-lg sm:text-2xl lg:text-3xl tracking-tighter text-white leading-none">
              2 MONOS
            </span>
            <span className="text-[6px] sm:text-[8px] font-bold tracking-widest bg-white text-[#0015ff] px-1.5 py-0.5 rounded-sm uppercase mt-1">
              DOUBLE IPA
            </span>
          </div>
        </button>
      </motion.div>
    </div>
  );
};
