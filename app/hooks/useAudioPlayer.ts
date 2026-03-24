/**
 * 音频播放器 Hook
 * 管理音频播放器的核心逻辑
 * 处理播放、暂停、进度更新、循环模式等功能
 */
import { useEffect, useRef, useCallback } from 'react'
import { useMusicPlayerStore } from '../stores/music-player-store'

/**
 * 音频播放器 Hook
 * @returns audioRef - audio 元素的 ref
 * @returns currentMusic - 当前播放的音乐
 * @returns handleTimeUpdate - 时间更新处理函数
 * @returns handleLoadedMetadata - 元数据加载完成处理函数
 * @returns handleEnded - 播放结束处理函数
 * @returns handleCanPlay - 可以播放处理函数
 * @returns handleWaiting - 等待缓冲处理函数
 * @returns handlePlaying - 正在播放处理函数
 * @returns seekTo - 跳转到指定时间
 */
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

	// 当前播放的音乐
	const currentMusic = currentIndex >= 0 && currentIndex < musicList.length ? musicList[currentIndex] : null

	// 同步音量
	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.volume = volume
		}
	}, [volume])

	// 切换音乐时重新加载
	useEffect(() => {
		if (audioRef.current && currentMusic) {
			audioRef.current.src = currentMusic.path
			audioRef.current.load()
			setIsLoading(true)
			if (isPlaying) {
				audioRef.current.play().catch(console.error)
			}
		}
	}, [currentMusic, isPlaying, setIsLoading])

	// 时间更新处理
	const handleTimeUpdate = useCallback(() => {
		if (audioRef.current) {
			setProgress(audioRef.current.currentTime)
		}
	}, [setProgress])

	// 元数据加载完成
	const handleLoadedMetadata = useCallback(() => {
		if (audioRef.current) {
			setDuration(audioRef.current.duration)
			setIsLoading(false)
		}
	}, [setDuration, setIsLoading])

	// 播放结束处理
	const handleEnded = useCallback(() => {
		if (loopMode === 'single-loop') {
			// 单曲循环：重新播放
			if (audioRef.current) {
				audioRef.current.currentTime = 0
				audioRef.current.play().catch(console.error)
			}
		} else {
			// 列表循环或顺序播放：播放下一首
			playNext()
		}
	}, [loopMode, playNext])

	// 可以播放
	const handleCanPlay = useCallback(() => {
		setIsLoading(false)
		if (isPlaying && audioRef.current) {
			audioRef.current.play().catch(console.error)
		}
	}, [isPlaying, setIsLoading])

	// 等待缓冲
	const handleWaiting = useCallback(() => {
		setIsLoading(true)
	}, [setIsLoading])

	// 正在播放
	const handlePlaying = useCallback(() => {
		setIsLoading(false)
	}, [setIsLoading])

	// 跳转到指定时间
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
