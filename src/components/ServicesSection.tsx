import React, { useState } from 'react';
import { SERVICES_DATA } from '../data/projectsData';
import { Language } from '../types';
import { Check, ArrowRight, Sparkles } from 'lucide-react';

interface ServicesSectionProps {
  language: Language;
  onInquire: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ language, onInquire }) => {
  const [activeTab, setActiveTab] = useState<string>('01');

  return (
    <section id="services" className="w-full bg-[#121212] text-white py-20 sm:py-28 px-4 sm:px-6 lg:px-8 my-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/15">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#FACC15] font-bold">
              02 / {language === 'es' ? 'DISCIPLINAS & SERVICIOS' : 'DISCIPLINES & EXPERTISE'}
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white mt-1 uppercase">
              {language === 'es' ? 'Cómo Transformamos Marcas' : 'How We Elevate Brands'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onInquire}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0015ff] hover:bg-[#0022ff] text-white font-mono font-bold text-xs uppercase tracking-wider rounded-lg transition-all"
          >
            <span>{language === 'es' ? 'Cotizar Proyecto' : 'Inquire Project'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Services List / Accordion */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
          {/* Numbers / Service titles */}
          <div className="lg:col-span-5 space-y-3 font-display">
            {SERVICES_DATA.map((srv) => (
              <div
                key={srv.number}
                onClick={() => setActiveTab(srv.number)}
                className={`p-5 rounded-xl cursor-pointer border transition-all ${
                  activeTab === srv.number
                    ? 'bg-white/10 border-[#0015ff] shadow-lg translate-x-2'
                    : 'bg-white/5 border-transparent hover:bg-white/[0.07] text-white/70'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm font-bold text-[#FACC15]">
                    {srv.number}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">
                    {srv.title[language]}
                  </h3>
                </div>
                <p className="text-xs text-white/60 font-sans mt-2 line-clamp-1">
                  {srv.subtitle[language]}
                </p>
              </div>
            ))}
          </div>

          {/* Service Details Pane */}
          <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-xl p-6 sm:p-10 flex flex-col justify-between">
            {(() => {
              const current = SERVICES_DATA.find((s) => s.number === activeTab) || SERVICES_DATA[0];
              return (
                <div className="space-y-6">
                  <div>
                    <span className="font-mono text-xs text-[#FACC15] font-bold uppercase tracking-widest">
                      {current.number} · {current.title[language]}
                    </span>
                    <h4 className="text-2xl sm:text-3xl font-display font-black text-white mt-2">
                      {current.subtitle[language]}
                    </h4>
                  </div>

                  <p className="text-sm sm:text-base text-neutral-300 font-sans leading-relaxed">
                    {current.description[language]}
                  </p>

                  <div className="pt-6 border-t border-white/10">
                    <h5 className="font-mono text-xs font-bold uppercase tracking-wider text-white/80 mb-3">
                      {language === 'es' ? 'Entregables Clave:' : 'Key Deliverables:'}
                    </h5>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {current.deliverables[language].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-neutral-300 font-sans">
                          <Check className="w-4 h-4 text-[#FACC15] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })()}

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/60">
              <span>Santiago, Chile · Proyectos Internacionales</span>
              <button
                type="button"
                onClick={onInquire}
                className="text-[#FACC15] hover:underline font-bold"
              >
                {language === 'es' ? 'Iniciar Conversación →' : 'Start a Project →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
