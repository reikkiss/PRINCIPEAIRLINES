import React, { useState } from 'react';
import { Project, Language } from '../types';
import { ArrowUpRight, Award, Sparkles } from 'lucide-react';

interface ProjectsGridProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  language: Language;
}

export const ProjectsGrid: React.FC<ProjectsGridProps> = ({
  projects,
  onSelectProject,
  language,
}) => {
  const [filter, setFilter] = useState<string>('all');

  const filteredProjects = projects.filter((p) => {
    if (filter === 'all') return true;
    return p.category === filter;
  });

  return (
    <section id="works" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-black/10">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#0015ff] font-bold">
            01 / {language === 'es' ? 'PROYECTOS DESTACADOS' : 'SELECTED WORKS'}
          </span>
          <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-neutral-900 mt-1 uppercase">
            {language === 'es' ? 'Marcas sin Aburrimiento' : 'Brands that Refuse Boring'}
          </h2>
        </div>

        {/* Category Filters (Clean Segmented Buttons) */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-black/5 rounded-lg text-xs font-mono">
          {[
            { id: 'all', label: language === 'es' ? 'Todos' : 'All' },
            { id: 'packaging', label: 'Packaging' },
            { id: 'branding', label: 'Branding' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFilter(cat.id)}
              className={`px-3 py-1.5 rounded-md transition-colors font-medium ${
                filter === cat.id
                  ? 'bg-black text-white shadow-sm'
                  : 'text-neutral-600 hover:text-black'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {filteredProjects.map((project, idx) => (
          <article
            key={project.id}
            onClick={() => onSelectProject(project)}
            className="group cursor-pointer flex flex-col justify-between bg-white rounded-xl overflow-hidden border border-black/10 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            {/* Visual Media Container */}
            <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors pointer-events-none" />

              {/* Awards badge if any */}
              {project.awards && (
                <div className="absolute top-3 left-3 bg-black/85 backdrop-blur-md text-[#FACC15] px-2.5 py-1 rounded text-[10px] font-mono font-bold flex items-center gap-1.5 shadow">
                  <Award className="w-3 h-3" />
                  <span>{project.awards}</span>
                </div>
              )}

              {/* View Project hover prompt */}
              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black p-2 rounded-full shadow-lg">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            {/* Content Details */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                {/* Clean unboxed metadata with bullet separators (Skill rule A) */}
                <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 mb-1.5">
                  <span>{project.categoryLabel[language]}</span>
                  <span aria-hidden="true">·</span>
                  <span>{project.year}</span>
                </div>

                <h3 className="font-display font-black text-xl text-neutral-900 group-hover:text-[#0015ff] transition-colors leading-tight">
                  {project.title}
                </h3>

                <p className="text-xs text-neutral-600 mt-2 line-clamp-2 font-sans">
                  {project.tagline[language]}
                </p>
              </div>

              {/* Footer link */}
              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-[#0015ff] font-semibold">
                <span>{language === 'es' ? 'Ver Caso Completo' : 'View Full Case Study'}</span>
                <span>→</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
