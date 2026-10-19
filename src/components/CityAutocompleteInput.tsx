import React, { useState, useEffect, useRef } from 'react';
import { searchAirports, AirportItem, getAirportByCity } from '../utils/airportLookup';
import { MapPin, Plane, Globe, Check } from 'lucide-react';

interface CityAutocompleteInputProps {
  label: string;
  value: string;
  onChange: (city: string) => void;
  onSelectAirport: (airport: AirportItem) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  isDark?: boolean;
}

export const CityAutocompleteInput: React.FC<CityAutocompleteInputProps> = ({
  label,
  value,
  onChange,
  onSelectAirport,
  placeholder = 'Buscar ciudad (ej. Tokio, Florencia, París)...',
  required = false,
  className = '',
  isDark = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<AirportItem[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Search as user types
  useEffect(() => {
    if (!value || value.trim().length < 1) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const matches = searchAirports(value, 6);
    setResults(matches);
    setHighlightedIndex(-1);
    setIsOpen(matches.length > 0);
  }, [value]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (airport: AirportItem) => {
    onChange(airport.city);
    onSelectAirport(airport);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) {
      if (e.key === 'Enter') {
        // Auto resolve top match
        const best = getAirportByCity(value);
        if (best) handleSelect(best);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      if (highlightedIndex >= 0 && highlightedIndex < results.length) {
        e.preventDefault();
        handleSelect(results[highlightedIndex]);
      } else if (results.length > 0) {
        // Pick first result on Enter
        e.preventDefault();
        handleSelect(results[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleBlur = () => {
    // Delay closing so click on suggestion can register
    setTimeout(() => {
      setIsOpen(false);
      // If user typed something and we haven't selected, auto-resolve to best match
      if (value && value.trim().length >= 2) {
        const best = getAirportByCity(value);
        if (best && best.city.toLowerCase() === value.trim().toLowerCase()) {
          onSelectAirport(best);
        }
      }
    }, 200);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="flex items-center justify-between mb-1">
        <label className={`block text-[11px] font-mono ${isDark ? 'text-white/70' : 'text-neutral-700 font-bold'}`}>
          {label} {required && '*'}
        </label>
        {value && (
          <span className="text-[9px] font-mono text-[#FACC15] flex items-center gap-1">
            <Globe className="w-3 h-3" />
            <span>Búsqueda automática</span>
          </span>
        )}
      </div>

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            if (value && results.length > 0) setIsOpen(true);
          }}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          required={required}
          autoComplete="off"
          className={`w-full px-2.5 py-1.5 rounded text-xs transition-all focus:outline-none ${
            isDark
              ? 'bg-black border border-white/20 text-white focus:border-[#FACC15] placeholder-white/30'
              : 'bg-white border border-neutral-300 text-neutral-900 focus:border-[#0015ff] placeholder-neutral-400'
          }`}
        />
        <Plane className={`w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${
          isDark ? 'text-white/30' : 'text-neutral-400'
        }`} />
      </div>

      {/* Floating Suggestions Dropdown */}
      {isOpen && results.length > 0 && (
        <div
          className={`absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-lg shadow-2xl border text-xs divide-y ${
            isDark
              ? 'bg-[#18181B] border-[#FACC15]/40 divide-white/10 text-white'
              : 'bg-white border-neutral-300 divide-neutral-100 text-neutral-900'
          }`}
        >
          {results.map((airport, index) => {
            const isHighlighted = index === highlightedIndex;
            return (
              <div
                key={`${airport.iata}-${airport.name}-${index}`}
                onMouseDown={() => handleSelect(airport)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`p-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                  isHighlighted
                    ? isDark
                      ? 'bg-white/15'
                      : 'bg-blue-50'
                    : isDark
                    ? 'hover:bg-white/10'
                    : 'hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden mr-2">
                  <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${
                    isDark ? 'bg-white/10 text-[#FACC15]' : 'bg-blue-100 text-blue-600'
                  }`}>
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col truncate">
                    <div className="font-bold flex items-center gap-1.5 truncate">
                      <span className={isDark ? 'text-white' : 'text-neutral-900'}>{airport.city}</span>
                      <span className={`text-[10px] ${isDark ? 'text-white/60' : 'text-neutral-500'}`}>
                        · {airport.country}
                      </span>
                    </div>
                    <span className={`text-[10px] truncate ${isDark ? 'text-white/40' : 'text-neutral-400'}`}>
                      {airport.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-semibold ${
                    isDark ? 'bg-white/10 text-white/70' : 'bg-neutral-100 text-neutral-600'
                  }`}>
                    {airport.region}
                  </span>
                  <span className="px-2 py-1 bg-[#FACC15] text-black font-mono font-black text-xs rounded tracking-wider shadow-sm">
                    {airport.iata}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
