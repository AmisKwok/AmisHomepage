"use client";

import { useState, useEffect, useRef } from "react";
import { useMusicPlayer, LoopMode, LOOP_MODES } from "../contexts/MusicPlayerContext";
import { useTheme } from "../contexts/ThemeContext";

const LOOP_MODE_LABELS: Record<LoopMode, { icon: string; title: string }> = {
  "list-loop": { icon: "fa-repeat", title: "列表循环" },
  "list-no-loop": { icon: "fa-angles-right", title: "列表不循环" },
  "single-loop": { icon: "fa-rotate-right", title: "单曲循环" },
  "single-no-loop": { icon: "fa-minus", title: "单曲不循环" },
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
    currentMusic,
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
    seekTo,
    playMusic,
    toggleExpand,
    togglePlaylist,
  } = useMusicPlayer();

  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(volume);
  const [animateExpand, setAnimateExpand] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

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
    e.stopPropagation();
  };

  if (musicList.length === 0) {
    return null;
  }

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
            className={`w-12 h-12 md:w-14 md:h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group ${
              isDark
                ? "bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20"
                : "bg-white/80 backdrop-blur-md border border-gray-200 hover:bg-white shadow-xl"
            }`}
            title="打开音乐播放器"
          >
            <div className="relative">
              {isLoading ? (
                <i className={`fas fa-spinner fa-spin text-lg ${isDark ? "text-white" : "text-gray-700"}`}></i>
              ) : (
                <i className={`fas fa-music text-lg ${isDark ? "text-white" : "text-gray-700"}`}></i>
              )}
              {isPlaying && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              )}
            </div>
          </button>
        ) : (
          <div
            className={`rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ease-out transform origin-bottom-right ${
              animateExpand ? "scale-100 opacity-100" : "scale-75 opacity-0"
            } ${
              isDark
                ? "bg-gray-900/95 backdrop-blur-xl border border-white/10"
                : "bg-white/95 backdrop-blur-xl border border-gray-200"
            }`}
          >
            <div className="p-4 md:p-5 min-w-[280px] md:min-w-[320px]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isDark ? "bg-gradient-to-br from-purple-500 to-pink-500" : "bg-gradient-to-br from-blue-500 to-purple-500"
                  }`}>
                    <i className="fas fa-music text-white text-sm"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isDark ? "text-white" : "text-gray-900"}`}>
                      {currentMusic?.name || "未选择音乐"}
                    </p>
                    <p className={`text-xs truncate ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      {currentMusic ? `${currentIndex + 1} / ${musicList.length}` : "点击播放开始"}
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
                    className={`h-full rounded-full transition-all ${
                      isDark ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-gradient-to-r from-blue-500 to-purple-500"
                    }`}
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
                      ? isDark ? "text-purple-400 bg-purple-500/20" : "text-purple-600 bg-purple-100"
                      : loopMode === "list-no-loop"
                      ? isDark ? "text-blue-400 bg-blue-500/20" : "text-blue-600 bg-blue-100"
                      : loopMode === "single-loop"
                      ? isDark ? "text-pink-400 bg-pink-500/20" : "text-pink-600 bg-pink-100"
                      : isDark ? "text-gray-400 hover:bg-white/10" : "text-gray-500 hover:bg-gray-100"
                  }`}
                  title={LOOP_MODE_LABELS[loopMode].title}
                >
                  <i className={`fas ${LOOP_MODE_LABELS[loopMode].icon} text-sm`}></i>
                  {loopMode === "single-loop" && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-pink-500 rounded-full flex items-center justify-center">
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
                    } [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-purple-500 [&::-webkit-slider-thumb]:to-pink-500`}
                  />
                </div>

                <button
                  onClick={togglePlaylist}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    showPlaylist
                      ? isDark ? "text-purple-400 bg-purple-500/20" : "text-purple-600 bg-purple-100"
                      : isDark ? "text-gray-400 hover:bg-white/10" : "text-gray-500 hover:bg-gray-100"
                  }`}
                  title="播放列表"
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
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${
                    isDark
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                      : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                  } disabled:opacity-50`}
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
                className={`music-playlist border-t overflow-y-auto ${
                  isDark ? "border-white/10 bg-black/20" : "border-gray-200 bg-gray-50"
                }`}
                style={{ maxHeight: "200px" }}
                onWheel={handlePlaylistScroll}
              >
                {musicList.map((music, index) => (
                  <button
                    key={music.id}
                    onClick={() => playMusic(index)}
                    className={`w-full px-4 py-2.5 flex items-center gap-3 text-left transition-colors ${
                      currentIndex === index
                        ? isDark
                          ? "bg-purple-500/20 text-purple-400"
                          : "bg-purple-100 text-purple-600"
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
        .animation-delay-100 {
          animation-delay: 100ms;
        }
        .animation-delay-200 {
          animation-delay: 200ms;
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
          background: rgba(139, 92, 246, 0.3);
          border-radius: 3px;
        }
        .music-playlist::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.5);
        }
        .dark .music-playlist::-webkit-scrollbar-thumb {
          background: rgba(167, 139, 250, 0.3);
        }
        .dark .music-playlist::-webkit-scrollbar-thumb:hover {
          background: rgba(167, 139, 250, 0.5);
        }
      `}</style>
    </>
  );
}
