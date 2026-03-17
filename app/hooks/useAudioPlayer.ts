import { useEffect, useRef, useCallback } from 'react'
import { useMusicPlayerStore } from '../stores/music-player-store'

export function useAudioPlayer() {
	const audioRef = useRef<HTMLAudioElement | null>(null)
	const {
		musicList,
		currentIndex,
		isPlaying,
		volume,
		loopMode,
		playNext,
		setProgress,
		setDuration,
		setIsLoading
	} = useMusicPlayerStore()

	const currentMusic = currentIndex >= 0 && currentIndex < musicList.length ? musicList[currentIndex] : null

	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.volume = volume
		}
	}, [volume])

	useEffect(() => {
		if (audioRef.current && currentMusic) {
			audioRef.current.src = currentMusic.path
			audioRef.current.load()
			setIsLoading(true)
			if (isPlaying) {
				audioRef.current.play().catch(console.error)
			}
		}
	}, [currentMusic?.id, currentMusic?.path, isPlaying, setIsLoading])

	const handleTimeUpdate = useCallback(() => {
		if (audioRef.current) {
			setProgress(audioRef.current.currentTime)
		}
	}, [setProgress])

	const handleLoadedMetadata = useCallback(() => {
		if (audioRef.current) {
			setDuration(audioRef.current.duration)
			setIsLoading(false)
		}
	}, [setDuration, setIsLoading])

	const handleEnded = useCallback(() => {
		if (loopMode === 'single-loop') {
			if (audioRef.current) {
				audioRef.current.currentTime = 0
				audioRef.current.play().catch(console.error)
			}
		} else {
			playNext()
		}
	}, [loopMode, playNext])

	const handleCanPlay = useCallback(() => {
		setIsLoading(false)
		if (isPlaying && audioRef.current) {
			audioRef.current.play().catch(console.error)
		}
	}, [isPlaying, setIsLoading])

	const handleWaiting = useCallback(() => {
		setIsLoading(true)
	}, [setIsLoading])

	const handlePlaying = useCallback(() => {
		setIsLoading(false)
	}, [setIsLoading])

	const seekTo = useCallback((time: number) => {
		if (audioRef.current) {
			audioRef.current.currentTime = time
			setProgress(time)
		}
	}, [setProgress])

	return {
		audioRef,
		currentMusic,
		handleTimeUpdate,
		handleLoadedMetadata,
		handleEnded,
		handleCanPlay,
		handleWaiting,
		handlePlaying,
		seekTo
	}
}
