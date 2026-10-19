import React, { useState, useEffect, useRef } from 'react';
import { AppleMusicTrack } from '../types';
import { Music, Search, Play, Pause, X, ExternalLink, Loader2, Disc3, Check, Volume2 } from 'lucide-react';

interface AppleMusicSelectorProps {
  selectedTrack?: AppleMusicTrack;
  onSelectTrack: (track: AppleMusicTrack | undefined) => void;
  initialManualText?: string;
  onManualTextChange?: (text: string) => void;
}

export const AppleMusicSelector: React.FC<AppleMusicSelectorProps> = ({
  selectedTrack,
  onSelectTrack,
  initialManualText = '',
  onManualTextChange,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AppleMusicTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [manualText, setManualText] = useState(initialManualText);
  const [showManualInput, setShowManualInput] = useState(false);
  
  // Audio preview playback state
  const [playingTrackId, setPlayingTrackId] = useState<string | number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  // Search Apple Music via iTunes search API
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      setIsSearching(true);
      try {
        const response = await fetch(
          `https://itunes.apple.com/search?term=${encodeURIComponent(query.trim())}&media=music&entity=song&limit=8`
        );
        if (!response.ok) throw new Error('Network error searching Apple Music');
        const data = await response.json();
        
        const tracks: AppleMusicTrack[] = (data.results || []).map((item: any) => ({
          id: item.trackId,
          title: item.trackName,
          artist: item.artistName,
          album: item.collectionName,
          // Replace 100x100 with 300x300 for crisp high-res retina artwork
          artworkUrl: item.artworkUrl100 ? item.artworkUrl100.replace('100x100bb', '300x300bb') : undefined,
          previewUrl: item.previewUrl,
          appleMusicUrl: item.trackViewUrl,
        }));
        
        setResults(tracks);
      } catch (err) {
        console.error('Apple Music search error:', err);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  // Audio preview handler
  const handleTogglePreview = (track: AppleMusicTrack, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!track.previewUrl) return;

    if (playingTrackId === track.id) {
      // Pause
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingTrackId(null);
    } else {
      // Play new preview
      if (!audioRef.current) {
        audioRef.current = new Audio();
        audioRef.current.onended = () => setPlayingTrackId(null);
      }
      audioRef.current.src = track.previewUrl;
      audioRef.current.play().catch((e) => console.log('Audio autoplay prevented', e));
      setPlayingTrackId(track.id);
    }
  };

  const handleSelectTrack = (track: AppleMusicTrack) => {
    // Stop any preview playback
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setPlayingTrackId(null);
    onSelectTrack(track);
    setQuery('');
    setResults([]);
    setIsSearching(false);
  };

  const handleClearSelected = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setPlayingTrackId(null);
    onSelectTrack(undefined);
  };

  return (
    <div className="space-y-3 font-sans">
      {/* 1. Selected Apple Music Track Card */}
      {selectedTrack ? (
        <div className="relative bg-gradient-to-r from-[#1E112A] via-[#161224] to-[#0F172A] border-2 border-rose-500/40 rounded-xl p-3.5 shadow-lg flex items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Artwork */}
            <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 shadow-md border border-white/20 bg-neutral-800">
              {selectedTrack.artworkUrl ? (
                <img
                  src={selectedTrack.artworkUrl}
                  alt={selectedTrack.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-rose-950 text-rose-300">
                  <Music className="w-6 h-6" />
                </div>
              )}

              {/* Play preview overlay on album cover if previewUrl exists */}
              {selectedTrack.previewUrl && (
                <button
                  type="button"
                  onClick={(e) => handleTogglePreview(selectedTrack, e)}
                  title={playingTrackId === selectedTrack.id ? 'Pausar muestra' : 'Escuchar muestra de 30s'}
                  className="absolute inset-0 bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors cursor-pointer group"
                >
                  {playingTrackId === selectedTrack.id ? (
                    <Pause className="w-6 h-6 text-rose-400 fill-rose-400 animate-pulse" />
                  ) : (
                    <Play className="w-6 h-6 text-white fill-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform" />
                  )}
                </button>
              )}
            </div>

            {/* Song Info */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                  <Disc3 className="w-3 h-3 animate-spin" style={{ animationDuration: '6s' }} />
                  Apple Music
                </span>
                {playingTrackId === selectedTrack.id && (
                  <span className="text-[10px] font-mono text-emerald-400 animate-pulse flex items-center gap-1">
                    <Volume2 className="w-3 h-3" />
                    Reproduciendo muestra
                  </span>
                )}
              </div>
              
              <h4 className="font-bold text-sm text-white truncate mt-1">
                {selectedTrack.title}
              </h4>
              <p className="text-xs text-rose-200/80 truncate font-mono">
                {selectedTrack.artist} {selectedTrack.album ? `· ${selectedTrack.album}` : ''}
              </p>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {selectedTrack.appleMusicUrl && (
              <a
                href={selectedTrack.appleMusicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer"
                title="Ver en Apple Music"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            <button
              type="button"
              onClick={handleClearSelected}
              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 hover:text-red-200 border border-red-500/20 transition-colors cursor-pointer"
              title="Cambiar o quitar canción"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* 2. Apple Music Search Input */
        <div className="space-y-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-rose-400">
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </div>
            
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar canción en Apple Music (ej: Perfect, Ed Sheeran, Morat)..."
              className="w-full pl-10 pr-10 py-2.5 bg-neutral-900 border border-rose-500/30 rounded-xl text-white placeholder-neutral-500 text-sm focus:border-rose-500 focus:outline-none shadow-inner"
            />

            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setResults([]);
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/40 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {isSearching && (
            <div className="bg-[#141419] border border-rose-500/30 rounded-xl overflow-hidden shadow-2xl max-h-72 overflow-y-auto divide-y divide-white/5">
              {isLoading && results.length === 0 ? (
                <div className="p-4 text-center text-xs font-mono text-neutral-400 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
                  <span>Buscando en catálogo de Apple Music...</span>
                </div>
              ) : results.length === 0 ? (
                <div className="p-4 text-center text-xs font-mono text-neutral-400">
                  No se encontraron canciones para "{query}". Intenta con otro término.
                </div>
              ) : (
                results.map((track) => (
                  <div
                    key={track.id}
                    onClick={() => handleSelectTrack(track)}
                    className="p-2.5 hover:bg-rose-950/40 flex items-center justify-between gap-3 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Thumbnail with Play/Pause button */}
                      <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-white/10 bg-neutral-800">
                        {track.artworkUrl ? (
                          <img
                            src={track.artworkUrl}
                            alt={track.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-rose-950 text-rose-300">
                            <Music className="w-4 h-4" />
                          </div>
                        )}

                        {track.previewUrl && (
                          <button
                            type="button"
                            onClick={(e) => handleTogglePreview(track, e)}
                            className="absolute inset-0 bg-black/40 hover:bg-black/70 flex items-center justify-center transition-colors cursor-pointer"
                            title={playingTrackId === track.id ? 'Pausar muestra' : 'Escuchar 30s'}
                          >
                            {playingTrackId === track.id ? (
                              <Pause className="w-4 h-4 text-rose-400 fill-rose-400 animate-pulse" />
                            ) : (
                              <Play className="w-4 h-4 text-white fill-white opacity-90 group-hover:scale-110 transition-transform" />
                            )}
                          </button>
                        )}
                      </div>

                      {/* Track Details */}
                      <div className="min-w-0">
                        <h5 className="text-xs font-bold text-white group-hover:text-rose-300 truncate">
                          {track.title}
                        </h5>
                        <p className="text-[11px] text-neutral-400 truncate">
                          {track.artist} {track.album ? `· ${track.album}` : ''}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectTrack(track)}
                      className="px-2.5 py-1 bg-rose-600/80 hover:bg-rose-600 text-white rounded-md text-[11px] font-mono font-bold shrink-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      <span>Seleccionar</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Manual Dedication / Song Fallback Toggle */}
      <div className="pt-1 flex items-center justify-between text-[11px] font-mono text-neutral-400">
        <button
          type="button"
          onClick={() => setShowManualInput(!showManualInput)}
          className="text-rose-400 hover:text-rose-300 hover:underline cursor-pointer flex items-center gap-1"
        >
          <span>{showManualInput ? 'Ocultar texto manual' : 'O escribir nombre de canción manualmente'}</span>
        </button>
        {selectedTrack && (
          <span className="text-neutral-500">Canción de Apple Music vinculada</span>
        )}
      </div>

      {showManualInput && (
        <input
          type="text"
          value={manualText}
          onChange={(e) => {
            setManualText(e.target.value);
            if (onManualTextChange) onManualTextChange(e.target.value);
          }}
          placeholder="Ej: Perfect - Ed Sheeran (Nuestra canción)"
          className="w-full px-3 py-2 bg-neutral-900 border border-white/20 rounded-lg text-white text-xs font-mono focus:border-rose-500 focus:outline-none"
        />
      )}
    </div>
  );
};
