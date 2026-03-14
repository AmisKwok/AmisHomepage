"use client";

import { createContext, useContext, useState, useEffect, useRef, ReactNode, useCallback } from "react";

export type LoopMode = "list-loop" | "list-no-loop" | "single-loop" | "single-no-loop";

export interface Music {
  id: string;
  name: string;
  path: string;
  order: number;
}

interface MusicPlayerContextType {
  musicList: Music[];
  currentMusic: Music | null;
  currentIndex: number;
  isPlaying: boolean;
  loopMode: LoopMode;
  volume: number;
  progress: number;
  duration: number;
  isExpanded: boolean;
  showPlaylist: boolean;
  isLoading: boolean;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  togglePlay: () => void;
  playNext: () => void;
  playPrev: () => void;
  setLoopMode: (mode: LoopMode) => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
  playMusic: (index: number) => void;
  toggleExpand: () => void;
  togglePlaylist: () => void;
  fetchMusicList: () => Promise<void>;
  setMusicList: (list: Music[]) => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

const LOOP_MODES: LoopMode[] = ["list-loop", "list-no-loop", "single-loop", "single-no-loop"];

export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  const [musicList, setMusicList] = useState<Music[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loopMode, setLoopModeState] = useState<LoopMode>("list-loop");
  const [volume, setVolumeState] = useState(0.7);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentMusic = currentIndex >= 0 && currentIndex < musicList.length ? musicList[currentIndex] : null;

  const fetchMusicList = useCallback(async () => {
    try {
      const response = await fetch("/api/music");
      const data = await response.json();
      if (data.success && data.music) {
        setMusicList(data.music);
        if (currentIndex === -1 && data.music.length > 0) {
          setCurrentIndex(0);
        }
      }
    } catch (error) {
      console.error("Failed to fetch music list:", error);
    }
  }, [currentIndex]);

  useEffect(() => {
    fetchMusicList();
    
    const savedVolume = localStorage.getItem("music-player-volume");
    if (savedVolume) {
      setVolumeState(parseFloat(savedVolume));
    }
    
    const savedLoopMode = localStorage.getItem("music-player-loop-mode") as LoopMode;
    if (savedLoopMode && LOOP_MODES.includes(savedLoopMode)) {
      setLoopModeState(savedLoopMode);
    }
  }, [fetchMusicList]);

  useEffect(() => {
    localStorage.setItem("music-player-volume", volume.toString());
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    localStorage.setItem("music-player-loop-mode", loopMode);
  }, [loopMode]);

  useEffect(() => {
    if (audioRef.current && currentMusic) {
      audioRef.current.src = currentMusic.path;
      audioRef.current.load();
      setIsLoading(true);
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [currentMusic?.id]);

  const playMusic = useCallback((index: number) => {
    if (index >= 0 && index < musicList.length) {
      setCurrentIndex(index);
      setIsPlaying(true);
    }
  }, [musicList.length]);

  const togglePlay = useCallback(() => {
    if (!currentMusic && musicList.length > 0) {
      playMusic(0);
      return;
    }
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  }, [currentMusic, musicList.length, isPlaying, playMusic]);

  const playNext = useCallback(() => {
    if (musicList.length === 0) return;
    
    let nextIndex = currentIndex;
    
    switch (loopMode) {
      case "single-loop":
        break;
      case "single-no-loop":
        if (currentIndex < musicList.length - 1) {
          nextIndex = currentIndex + 1;
        } else {
          setIsPlaying(false);
          return;
        }
        break;
      case "list-loop":
        nextIndex = (currentIndex + 1) % musicList.length;
        break;
      case "list-no-loop":
        if (currentIndex < musicList.length - 1) {
          nextIndex = currentIndex + 1;
        } else {
          setIsPlaying(false);
          return;
        }
        break;
    }
    
    playMusic(nextIndex);
  }, [musicList.length, currentIndex, loopMode, playMusic]);

  const playPrev = useCallback(() => {
    if (musicList.length === 0) return;
    
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    
    let prevIndex = currentIndex;
    
    switch (loopMode) {
      case "single-loop":
        break;
      case "list-loop":
        prevIndex = (currentIndex - 1 + musicList.length) % musicList.length;
        break;
      case "single-no-loop":
      case "list-no-loop":
        if (currentIndex > 0) {
          prevIndex = currentIndex - 1;
        }
        break;
    }
    
    playMusic(prevIndex);
  }, [musicList.length, currentIndex, loopMode, playMusic]);

  const setLoopMode = useCallback((mode: LoopMode) => {
    setLoopModeState(mode);
  }, []);

  const cycleLoopMode = useCallback(() => {
    const currentModeIndex = LOOP_MODES.indexOf(loopMode);
    const nextModeIndex = (currentModeIndex + 1) % LOOP_MODES.length;
    setLoopModeState(LOOP_MODES[nextModeIndex]);
  }, [loopMode]);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(Math.max(0, Math.min(1, newVolume)));
  }, []);

  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  }, []);

  const toggleExpand = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const togglePlaylist = useCallback(() => {
    setShowPlaylist(prev => !prev);
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setIsLoading(false);
    }
  }, []);

  const handleEnded = useCallback(() => {
    if (loopMode === "single-loop") {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(console.error);
      }
    } else {
      playNext();
    }
  }, [loopMode, playNext]);

  const handleCanPlay = useCallback(() => {
    setIsLoading(false);
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(console.error);
    }
  }, [isPlaying]);

  return (
    <MusicPlayerContext.Provider
      value={{
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
        audioRef,
        togglePlay,
        playNext,
        playPrev,
        setLoopMode,
        setVolume,
        seekTo,
        playMusic,
        toggleExpand,
        togglePlaylist,
        fetchMusicList,
        setMusicList,
      }}
    >
      {children}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onCanPlay={handleCanPlay}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => setIsLoading(false)}
      />
    </MusicPlayerContext.Provider>
  );
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext);
  if (context === undefined) {
    throw new Error("useMusicPlayer must be used within a MusicPlayerProvider");
  }
  return context;
}

export { LOOP_MODES };
