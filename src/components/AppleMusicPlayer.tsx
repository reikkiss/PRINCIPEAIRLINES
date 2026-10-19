import React, { useState, useRef, useEffect } from 'react';
import { AppleMusicTrack } from '../types';
import { Play, Pause, ExternalLink, Disc3, Volume2 } from 'lucide-react';

interface AppleMusicPlayerProps {
  track: AppleMusicTrack;
  variant?: 'full' | 'compact';
}

export const AppleMusicPlayer: React.FC<AppleMusicPlayerProps> = ({
  track,
  variant = 'full',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handlePause = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('play', handlePlay);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('play', handlePlay);
      audio.pause();
    };
  }, [track.previewUrl]);

  const togglePlay = () => {
    if (!audioRef.current || !track.previewUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => console.log('Playback error', err));
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (variant === 'compact') {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono shadow-2xs">
        {track.previewUrl && (
          <audio ref={audioRef} src={track.previewUrl} preload="none" />
        )}
        <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 border border-rose-300">
          {track.artworkUrl ? (
            <img src={track.artworkUrl} alt={track.title} className="w-full h-full object-cover" />
          ) : (
            <Disc3 className="w-full h-full p-0.5 text-rose-500" />
          )}
        </div>
        <span className="font-bold truncate max-w-[150px]">{track.title}</span>
        <span className="text-rose-400">·</span>
        <span className="text-neutral-500 truncate max-w-[100px]">{track.artist}</span>
        {track.previewUrl && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className="p-1 rounded-full hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
            title={isPlaying ? 'Pausar' : 'Reproducir'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-rose-600" /> : <Play className="w-3.5 h-3.5 fill-rose-600" />}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-r from-[#170B1F] via-[#101326] to-[#0A111F] text-white rounded-2xl p-4 sm:p-5 border border-rose-500/30 shadow-xl overflow-hidden relative">
      {track.previewUrl && (
        <audio ref={audioRef} src={track.previewUrl} preload="none" />
      )}

      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
        {/* Left: Album cover with spinning disc effect & Play Button */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 shadow-2xl border-2 border-white/20 group">
            {track.artworkUrl ? (
              <img
                src={track.artworkUrl}
                alt={track.title}
                className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'scale-105' : ''}`}
              />
            ) : (
              <div className="w-full h-full bg-rose-950 flex items-center justify-center text-rose-300">
                <Disc3 className="w-8 h-8" />
              </div>
            )}

            {/* Play/Pause overlay */}
            {track.previewUrl && (
              <button
                type="button"
                onClick={togglePlay}
                className="absolute inset-0 bg-black/40 hover:bg-black/60 flex items-center justify-center transition-all cursor-pointer group-hover:scale-105"
                title={isPlaying ? 'Pausar Muestra' : 'Reproducir Muestra (30s)'}
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-rose-400 fill-rose-400" />
                ) : (
                  <Play className="w-8 h-8 text-white fill-white translate-x-0.5" />
                )}
              </button>
            )}
          </div>

          {/* Track Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold tracking-widest uppercase bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded border border-rose-500/40">
                <Disc3 className={`w-3 h-3 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
                CANCIÓN EN APPLE MUSIC
              </span>
              {isPlaying && (
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 animate-pulse">
                  <Volume2 className="w-3 h-3" />
                  Reproduciendo
                </span>
              )}
            </div>

            <h3 className="font-display font-bold text-base sm:text-lg text-white truncate leading-snug">
              {track.title}
            </h3>
            <p className="text-xs sm:text-sm text-rose-200/80 font-mono truncate">
              {track.artist}
            </p>
            {track.album && (
              <p className="text-[11px] text-neutral-400 font-sans truncate mt-0.5">
                Álbum: {track.album}
              </p>
            )}
          </div>
        </div>

        {/* Right: Apple Music Direct Link Button */}
        {track.appleMusicUrl && (
          <a
            href={track.appleMusicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold border border-white/20 transition-all hover:scale-102 shrink-0 cursor-pointer shadow-md"
          >
            <span>Escuchar en Apple Music</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* Progress Bar (when preview is available) */}
      {track.previewUrl && (
        <div className="mt-4 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 mb-1.5">
            <span>Muestra previa (30s)</span>
            <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
          </div>
          
          <div
            onClick={(e) => {
              if (!audioRef.current || !duration) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const percentage = clickX / rect.width;
              audioRef.current.currentTime = percentage * duration;
            }}
            className="w-full h-2 bg-white/10 rounded-full overflow-hidden cursor-pointer relative group"
          >
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-amber-400 rounded-full transition-all duration-150"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
