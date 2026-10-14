import React from 'react';
import { Project, Language } from '../types';
import { X, Award, CheckCircle2, Package, Sparkles } from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  language: Language;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  language,
}) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#FAF9F5] text-[#121212] rounded-xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-neutral-300">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-[#0015ff] uppercase">
              {project.categoryLabel[language]}
            </span>
            <span className="text-neutral-300">|</span>
            <span className="text-xs font-mono text-neutral-500">
              {project.client} · {project.year}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="p-1.5 text-neutral-500 hover:text-black hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8 space-y-8">
          {/* Hero Image */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-xl overflow-hidden bg-neutral-900 shadow-md">
            <img
              src={project.image}
              alt={project.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {project.awards && (
              <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-[#FACC15] px-3 py-1.5 rounded text-xs font-mono font-bold flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                <span>{project.awards}</span>
              </div>
            )}
          </div>

          {/* Title & Tagline */}
          <div>
            <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-neutral-950 uppercase">
              {project.title}
            </h2>
            <p className="text-base sm:text-lg text-neutral-700 font-sans mt-2 font-medium">
              {project.tagline[language]}
            </p>
          </div>

          {/* Description */}
          <div className="prose max-w-none text-sm text-neutral-700 leading-relaxed font-sans">
            <p>{project.description[language]}</p>
          </div>

          {/* Challenge & Solution Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white rounded-xl border border-neutral-200">
            <div>
              <h3 className="font-mono text-xs font-bold uppercase text-red-600 mb-2">
                {language === 'es' ? 'El Desafío' : 'The Challenge'}
              </h3>
              <p className="text-xs text-neutral-700 leading-relaxed">
                {project.challenge[language]}
              </p>
            </div>

            <div>
              <h3 className="font-mono text-xs font-bold uppercase text-[#0015ff] mb-2">
                {language === 'es' ? 'La Solución Versal' : 'The Versal Solution'}
              </h3>
              <p className="text-xs text-neutral-700 leading-relaxed">
                {project.solution[language]}
              </p>
            </div>
          </div>

          {/* Results List */}
          <div>
            <h3 className="font-mono text-xs font-bold uppercase text-neutral-900 mb-3">
              {language === 'es' ? 'Impacto Comercial & Resultados' : 'Business Results'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {project.results[language].map((res, i) => (
                <div key={i} className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 font-medium flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{res}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Specifications */}
          <div className="p-5 bg-neutral-100 rounded-xl font-mono text-xs text-neutral-700 space-y-2">
            <div className="font-bold uppercase text-neutral-900 mb-1">
              {language === 'es' ? 'Especificaciones Técnicas de Producción' : 'Production Specs'}
            </div>
            {project.specs.materials && (
              <div><strong>Materiales:</strong> {project.specs.materials}</div>
            )}
            {project.specs.finishes && (
              <div><strong>Acabados:</strong> {project.specs.finishes}</div>
            )}
            <div>
              <strong>Entregables:</strong> {project.specs.deliverables.join(' · ')}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 bg-white flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-colors"
          >
            {language === 'es' ? 'Cerrar' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
