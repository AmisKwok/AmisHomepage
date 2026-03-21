/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import { useMusicPlayerStore } from "../../stores/music-player-store";
import type { LoopMode } from "../../../types";
import { useThemeStore } from "../../stores/theme-store";
import { useLanguageStore } from "../../stores/language-store";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";

const LOOP_MODES: LoopMode[] = ['list-loop', 'list-no-loop', 'single-loop', 'single-no-loop']

const LOOP_MODE_LABELS: Record<LoopMode, { icon: string; titleKey: string }> = {
  "list-loop": { icon: "fa-repeat", titleKey: "listLoop" },
  "list-no-loop": { icon: "fa-angles-right", titleKey: "listNoLoop" },
  "single-loop": { icon: "fa-rotate-right", titleKey: "singleLoop" },
  "single-no-loop": { icon: "fa-minus", titleKey: "singleNoLoop" },
};

function formatTime(seconds: number): string {
  if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function MusicPlayer() {
  const {
    musicList,
    currentIndex,
    isPlaying,
    loopMode,
    volume,
    progress,
    duration,
    isExpanded,
    showPlaylist,
    isLoading,
    togglePlay,
    playNext,
    playPrev,
    setLoopMode,
    setVolume,
    playMusic,
    toggleExpand,
    togglePlaylist,
  } = useMusicPlayerStore();

  const {
    audioRef,
    currentMusic,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleEnded,
    handleCanPlay,
    handleWaiting,
    handlePlaying,
    seekTo
  } = useAudioPlayer();

  const { theme } = useThemeStore();
  const { t } = useLanguageStore();
  const isDark = theme === "dark";
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(volume);
  const [animateExpand, setAnimateExpand] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    useMusicPlayerStore.getState().fetchMusicList()
  }, [])

  useEffect(() => {
    if (isExpanded) {
      setTimeout(() => {
        setAnimateExpand(true);
      }, 10);
    }
  }, [isExpanded]);

  const handleToggleExpand = () => {
    if (isExpanded) {
      setAnimateExpand(false);
      setTimeout(() => {
        toggleExpand();
      }, 300);
    } else {
      toggleExpand();
      setTimeout(() => {
        setAnimateExpand(true);
      }, 10);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (playerRef.current && !playerRef.current.contains(event.target as Node)) {
        if (isExpanded) {
          setAnimateExpand(false);
          setTimeout(() => {
            toggleExpand();
          }, 300);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded, toggleExpand]);

  const cycleLoopMode = () => {
    const currentModeIndex = LOOP_MODES.indexOf(loopMode);
    const nextModeIndex = (currentModeIndex + 1) % LOOP_MODES.length;
    setLoopMode(LOOP_MODES[nextModeIndex]);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    seekTo(percentage * duration);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (isMuted && newVolume > 0) {
      setIsMuted(false);
    }
    if (!isMuted) {
      setPreviousVolume(newVolume);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(previousVolume === 0 ? 0.5 : previousVolume);
      setIsMuted(false);
    } else {
      setPreviousVolume(volume);
      setVolume(0);
      setIsMuted(true);
    }
  };

  const handlePlaylistScroll = (e: React.WheelEvent) => {
    if (musicList.length > 5) {
      e.stopPropagation();
    }
  };

  if (musicList.length === 0) {
    return null;
  }

  const themeColors = {
    dark: {
      primary: 'violet',
      secondary: 'indigo',
      tertiary: 'purple',
      gradient: 'from-violet-500 to-indigo-500',
      gradientHover: 'from-violet-600 to-indigo-600',
      bgLight: 'bg-violet-500/20',
      textLight: 'text-violet-400',
      scrollbar: 'rgba(139, 92, 246, 0.3)',
      scrollbarHover: 'rgba(139, 92, 246, 0.5)',
    },
    light: {
      primary: 'stone',
      secondary: 'amber',
      tertiary: 'orange',
      gradient: 'from-stone-500 to-orange-500',
      gradientHover: 'from-stone-600 to-orange-600',
      bgLight: 'bg-stone-100',
      textLight: 'text-stone-600',
      scrollbar: 'rgba(120, 113, 108, 0.3)',
      scrollbarHover: 'rgba(120, 113, 108, 0.5)',
    }
  };

  const colors = isDark ? themeColors.dark : themeColors.light;

  return (
    <>
      <div
        ref={playerRef}
        className={`fixed z-50 transition-all duration-400 ease-out transform origin-bottom-right
          ${isExpanded 
            ? "bottom-24 right-8 md:bottom-28 md:right-8" 
            : "bottom-24 right-8 md:bottom-28 md:right-8"
          }
        `}
      >
        {!isExpanded ? (
          <button
            onClick={handleToggleExpand}
            className={`relative w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${
              isDark
                ? "bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20"
                : "bg-white/20 backdrop-blur-md hover:bg-white/30 border border-white/30"
            }`}
            title="打开音乐播放器"
          >
            {isPlaying && (
              <>
                {(isDark ? [
                  { delay: 0, bg: 'bg-violet-500', opacity: 0.2 },
                  { delay: 500, bg: 'bg-indigo-500', opacity: 0.15 },
                  { delay: 1000, bg: 'bg-purple-500', opacity: 0.1 },
                ] : [
                  { delay: 0, bg: 'bg-stone-500', opacity: 0.2 },
                  { delay: 500, bg: 'bg-amber-500', opacity: 0.15 },
                  { delay: 1000, bg: 'bg-orange-500', opacity: 0.1 },
                ]).map((ripple, i) => (
                  <span
                    key={i}
                    className={`absolute w-10 h-10 md:w-12 md:h-12 rounded-full ${ripple.bg} animate-ripple`}
                    style={{ animationDelay: `${ripple.delay}ms`, willChange: 'transform, opacity', opacity: ripple.opacity }}
                  />
                ))}
              </>
            )}
            <div className="relative z-10">
              {isLoading ? (
                <i className={`fas fa-spinner fa-spin text-lg ${isDark ? "text-white/80" : "text-gray-700"}`}></i>
              ) : (
                <i className={`fas fa-music text-lg ${isDark ? "text-white/80" : "text-gray-700"}`}></i>
              )}
              {isPlaying && (
                <span className={`absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full animate-pulse md:hidden bg-linear-to-r ${colors.gradient}`}></span>
              )}
            </div>
          </button>
        ) : (
          <div
            className={`rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ease-out transform origin-bottom-right ${
              animateExpand ? "scale-100 opacity-100" : "scale-75 opacity-0"
            } ${
              isDark
                ? "bg-gray-900/70 backdrop-blur-2xl border border-white/10"
                : "bg-white/70 backdrop-blur-2xl border border-gray-200"
            }`}
          >
            <div className="p-4 md:p-5 min-w-[280px] md:min-w-[320px]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-linear-to-br ${colors.gradient}`}>
                    <i className="fas fa-music text-white text-sm"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isDark ? "text-white" : "text-gray-900"}`}>
                      {currentMusic?.name || "未选择音乐"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleToggleExpand}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    isDark ? "hover:bg-white/10 text-gray-400" : "hover:bg-gray-100 text-gray-500"
                  }`}
                >
                  <i className="fas fa-chevron-down"></i>
                </button>
              </div>

              <div className="mb-3">
                <div
                  className={`h-1.5 rounded-full cursor-pointer ${
                    isDark ? "bg-white/10" : "bg-gray-200"
                  }`}
                  onClick={handleProgressClick}
                >
                  <div
                    className={`h-full rounded-full transition-all bg-linear-to-r ${colors.gradient}`}
                    style={{ width: duration > 0 ? `${(progress / duration) * 100}%` : "0%" }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                    {formatTime(progress)}
                  </span>
                  <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                    {formatTime(duration)}
                  </span>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-3 mb-3">
                <button
                  onClick={cycleLoopMode}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors relative ${
                    loopMode === "list-loop"
                      ? `${colors.textLight} ${colors.bgLight}`
                      : loopMode === "list-no-loop"
                      ? isDark ? "text-indigo-400 bg-indigo-500/20" : "text-amber-600 bg-amber-100"
                      : loopMode === "single-loop"
                      ? isDark ? "text-purple-400 bg-purple-500/20" : "text-emerald-600 bg-emerald-100"
                      : isDark ? "text-gray-400 hover:bg-white/10" : "text-gray-500 hover:bg-gray-100"
                  }`}
                  title={t(LOOP_MODE_LABELS[loopMode].titleKey as any)}
                >
                  <i className={`fas ${LOOP_MODE_LABELS[loopMode].icon} text-sm`}></i>
                  {loopMode === "single-loop" && (
                    <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                      isDark ? 'bg-purple-500' : 'bg-orange-500'
                    }`}>
                      <span className="text-[8px] font-bold text-white">1</span>
                    </span>
                  )}
                </button>

                <div className="flex items-center gap-2 flex-1">
                  <button
                    onClick={toggleMute}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      isMuted
                        ? isDark ? "text-red-400 bg-red-500/20" : "text-red-600 bg-red-100"
                        : isDark ? "text-gray-400 hover:bg-white/10" : "text-gray-500 hover:bg-gray-100"
                    }`}
                    title={isMuted ? "取消静音" : "静音"}
                  >
                    <i className={`fas ${isMuted ? "fa-volume-xmark" : volume === 0 ? "fa-volume-off" : volume < 0.5 ? "fa-volume-low" : "fa-volume-high"} text-sm`}></i>
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className={`flex-1 h-1 rounded-full appearance-none cursor-pointer ${
                      isDark ? "bg-white/20" : "bg-gray-200"
                    } [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full ${
                      isDark 
                        ? '[&::-webkit-slider-thumb]:bg-linear-to-r [&::-webkit-slider-thumb]:from-violet-500 [&::-webkit-slider-thumb]:to-indigo-500'
                        : '[&::-webkit-slider-thumb]:bg-linear-to-r [&::-webkit-slider-thumb]:from-stone-500 [&::-webkit-slider-thumb]:to-orange-500'
                    }`}
                  />
                </div>

                <button
                  onClick={togglePlaylist}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    showPlaylist
                      ? `${colors.textLight} ${colors.bgLight}`
                      : isDark ? "text-gray-400 hover:bg-white/10" : "text-gray-500 hover:bg-gray-100"
                  }`}
                  title={t("playlist")}
                >
                  <i className="fas fa-list text-sm"></i>
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 md:gap-6">
                <button
                  onClick={playPrev}
                  disabled={musicList.length === 0}
                  className={`w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-all ${
                    isDark
                      ? "bg-white/10 hover:bg-white/20 text-white disabled:opacity-30"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-30"
                  }`}
                >
                  <i className="fas fa-backward-step text-lg"></i>
                </button>

                <button
                  onClick={togglePlay}
                  disabled={musicList.length === 0}
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all shadow-lg text-white disabled:opacity-50 ${
                    isDark 
                      ? 'bg-linear-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600'
                      : 'bg-linear-to-r from-stone-500 to-orange-500 hover:from-stone-600 hover:to-orange-600'
                  }`}
                >
                  {isLoading ? (
                    <i className="fas fa-spinner fa-spin text-xl"></i>
                  ) : isPlaying ? (
                    <i className="fas fa-pause text-xl"></i>
                  ) : (
                    <i className="fas fa-play text-xl ml-1"></i>
                  )}
                </button>

                <button
                  onClick={playNext}
                  disabled={musicList.length === 0}
                  className={`w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-all ${
                    isDark
                      ? "bg-white/10 hover:bg-white/20 text-white disabled:opacity-30"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-30"
                  }`}
                >
                  <i className="fas fa-forward-step text-lg"></i>
                </button>
              </div>
            </div>

            {showPlaylist && (
              <div
                className={`music-playlist border-t backdrop-blur-2xl ${
                  isDark ? "border-white/10 bg-black/20" : "border-gray-200 bg-white/20"
                } ${musicList.length > 5 ? "overflow-y-auto" : "overflow-y-visible"}`}
                style={musicList.length > 5 ? { maxHeight: "200px" } : {}}
                onWheel={handlePlaylistScroll}
              >
                <div className={`px-4 py-2 border-b ${
                  isDark ? "border-white/10" : "border-gray-200"
                }`}>
                  <p className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    {t("totalMusic")(musicList.length)}
                  </p>
                </div>
                {musicList.map((music, index) => (
                  <button
                    key={music.id}
                    onClick={() => playMusic(index)}
                    className={`w-full px-4 py-2.5 flex items-center gap-3 text-left transition-colors ${
                      currentIndex === index
                        ? isDark
                          ? `${colors.bgLight} ${colors.textLight}`
                          : "bg-orange-100 text-orange-600"
                        : isDark
                          ? "hover:bg-white/5 text-gray-300"
                          : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <div className="w-5 text-center">
                      {currentIndex === index && isPlaying ? (
                        <i className="fas fa-volume-up text-xs"></i>
                      ) : (
                        <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                          {index + 1}
                        </span>
                      )}
                    </div>
                    <span className="text-sm truncate flex-1">{music.name}</span>
                    {currentIndex === index && (
                      <div className="flex gap-0.5">
                        <span className="w-0.5 h-3 bg-current rounded-full animate-pulse"></span>
                        <span className="w-0.5 h-4 bg-current rounded-full animate-pulse animation-delay-100"></span>
                        <span className="w-0.5 h-2 bg-current rounded-full animate-pulse animation-delay-200"></span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onCanPlay={handleCanPlay}
        onWaiting={handleWaiting}
        onPlaying={handlePlaying}
      />

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes expandIn {
          0% {
            transform: scale(0.7);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes ripple {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }
        .animation-delay-100 {
          animation-delay: 100ms;
        }
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        .animation-delay-500 {
          animation-delay: 500ms;
        }
        .animation-delay-1000 {
          animation-delay: 1000ms;
        }
        .animate-ripple {
          animation: ripple 1.5s ease-out infinite;
        }
        .opacity-15 {
          opacity: 0.15;
        }
        .opacity-10 {
          opacity: 0.1;
        }
      `}</style>
      <style jsx global>{`
        .music-playlist::-webkit-scrollbar {
          width: 6px;
        }
        .music-playlist::-webkit-scrollbar-track {
          background: transparent;
        }
        .music-playlist::-webkit-scrollbar-thumb {
          background: ${colors.scrollbar};
          border-radius: 3px;
        }
        .music-playlist::-webkit-scrollbar-thumb:hover {
          background: ${colors.scrollbarHover};
        }
      `}</style>
    </>
  );
}
