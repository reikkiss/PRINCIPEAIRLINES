import React from 'react';
import { HeroStickers } from './HeroStickers';
import { Crown, Heart, Plane, Mail, MapPin, Sparkles } from 'lucide-react';
import raulImg from '../assets/images/RAUL.png';

interface HeroProps {
  onScrollToSection?: (sectionId: string) => void;
  customHeroImage?: string;
}

export const Hero: React.FC<HeroProps> = ({
  onScrollToSection,
  customHeroImage,
}) => {
  // Use custom uploaded image if available, otherwise default to the generated Mediterranean stationery image
  const heroImgSrc =
    customHeroImage ||
    '/src/assets/images/mediterranean_love_stationery_1792013872743.jpg';

  return (
    <section className="relative w-full min-h-[92vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 sm:py-20 overflow-hidden bg-[#FAF6EE]">
      {/* Top Centered Logo / Image ("RAUL & REIKIS") */}
      <div className="relative z-50 mb-4 sm:mb-6 w-full max-w-[220px] sm:max-w-md mx-auto flex justify-center">
        <img
          src={raulImg}
          alt="Raul & Reikis"
          className="w-full h-auto object-contain max-h-[100px] sm:max-h-[180px] md:max-h-[247px] drop-shadow-md select-none"
        />
      </div>

      {/* Interactive Draggable Romantic Stickers (Scalloped Menu, Roman Arch, Navy Checkers, Citrus Tag) */}
      <HeroStickers onScrollToSection={onScrollToSection} />

      {/* Main Content Container */}
      <div className="relative z-20 max-w-6xl w-full mx-auto text-center flex flex-col items-center">
        {/* The Hero Image: Styled in a Roman Arch Frame with Terracotta & Scalloped Accents */}
        <div className="w-full relative group max-w-5xl">
          {/* Background Decorative Candy-Stripe & Scalloped Border Silhouette */}
          <div className="absolute -inset-3 rounded-t-[4.2rem] rounded-b-2xl bg-gradient-to-r from-[#E05A36] via-[#F4A62A] to-[#0E2340] opacity-80 blur-xs -z-10 group-hover:opacity-100 transition-opacity" />

          <div className="relative w-full aspect-[3/4] sm:aspect-[4/3] md:aspect-[16/12] lg:aspect-[16/11] min-h-[620px] sm:min-h-[780px] md:min-h-[920px] lg:min-h-[1050px] max-h-[1200px] rounded-t-[4rem] rounded-b-2xl overflow-hidden shadow-2xl border-4 border-white bg-[#0E2340]">
            <img
              src={heroImgSrc}
              alt="Principe Airlines - Mediterranean Love Stationery, Cartas de Amor & Boletos"
              className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out"
              referrerPolicy="no-referrer"
            />

            {/* Subtle Warm Gradient Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

            {/* Top Pattern Ribbon */}
            <div className="absolute top-0 left-0 right-0 h-3 pattern-stripes-terracotta border-b border-white/20" />

            {/* Bottom Floating Bar on the Image with Royal Crown & VIP Passenger info */}
            <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 right-3 sm:right-6 flex flex-wrap items-center justify-between gap-3 text-white pointer-events-none">
              <div className="flex items-center gap-2.5 bg-[#0E2340]/85 backdrop-blur-md px-4 py-2 rounded-full border border-amber-300/40 text-xs sm:text-sm font-mono shadow-lg">
                <Crown className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span className="font-bold tracking-wider text-amber-200">PASAJERO VIP: RAUL & REIKIS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
