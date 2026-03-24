/**
 * 音乐播放器状态管理 Store
 * 使用 Zustand 管理音乐播放器的所有状态
 * 支持播放控制、循环模式、音量调节等功能
 */
import { create } from 'zustand'
import type { Music, LoopMode } from '../../types'

// 音乐播放器 Store 接口定义
interface MusicPlayerStore {
	// 状态
	musicList: Music[]              // 音乐列表
	currentIndex: number            // 当前播放索引
	isPlaying: boolean              // 是否正在播放
	loopMode: LoopMode              // 循环模式
	volume: number                  // 音量 (0-1)
	progress: number                // 播放进度（秒）
	duration: number                // 总时长（秒）
	isExpanded: boolean             // 播放器是否展开
	showPlaylist: boolean           // 是否显示播放列表
	isLoading: boolean              // 是否正在加载

	// Actions
	setMusicList: (list: Music[]) => void
	setCurrentIndex: (index: number) => void
	setIsPlaying: (playing: boolean) => void
	setLoopMode: (mode: LoopMode) => void
	setVolume: (volume: number) => void
	setProgress: (progress: number) => void
	setDuration: (duration: number) => void
	toggleExpand: () => void
	togglePlaylist: () => void
	setIsLoading: (loading: boolean) => void
	playMusic: (index: number) => void
	togglePlay: () => void
	playNext: () => void
	playPrev: () => void
	fetchMusicList: () => Promise<void>
}

// 支持的循环模式列表
const LOOP_MODES: LoopMode[] = ['list-loop', 'list-no-loop', 'single-loop', 'single-no-loop']

export const useMusicPlayerStore = create<MusicPlayerStore>((set, get) => ({
	// 初始状态
	musicList: [],
	currentIndex: -1,
	isPlaying: false,
	loopMode: 'list-loop',
	volume: 0.7,
	progress: 0,
	duration: 0,
	isExpanded: false,
	showPlaylist: false,
	isLoading: false,

	// 基础 setter 方法
	setMusicList: (list) => set({ musicList: list }),
	setCurrentIndex: (index) => set({ currentIndex: index }),
	setIsPlaying: (playing) => set({ isPlaying: playing }),

	// 设置循环模式并持久化
	setLoopMode: (mode) => {
		localStorage.setItem('music-player-loop-mode', mode)
		set({ loopMode: mode })
	},

	// 设置音量并持久化
	setVolume: (volume) => {
		localStorage.setItem('music-player-volume', volume.toString())
		set({ volume })
	},

	setProgress: (progress) => set({ progress }),
	setDuration: (duration) => set({ duration }),
	toggleExpand: () => set((state) => ({ isExpanded: !state.isExpanded })),
	togglePlaylist: () => set((state) => ({ showPlaylist: !state.showPlaylist })),
	setIsLoading: (loading) => set({ isLoading: loading }),

	// 播放指定索引的音乐
	playMusic: (index) => {
		const { musicList } = get()
		if (index >= 0 && index < musicList.length) {
			set({ currentIndex: index, isPlaying: true })
		}
	},

	// 切换播放/暂停
	togglePlay: () => {
		const { musicList, currentIndex, isPlaying, playMusic } = get()
		// 如果没有选中歌曲，自动播放第一首
		if (currentIndex === -1 && musicList.length > 0) {
			playMusic(0)
			return
		}
		set({ isPlaying: !isPlaying })
	},

	// 播放下一首
	playNext: () => {
		const { musicList, currentIndex, loopMode, playMusic, setIsPlaying } = get()
		if (musicList.length === 0) return

		let nextIndex = currentIndex

		switch (loopMode) {
			case 'single-loop':
				// 单曲循环：不改变索引
				break
			case 'single-no-loop':
				// 单曲不循环：播放下一首，到末尾停止
				if (currentIndex < musicList.length - 1) {
					nextIndex = currentIndex + 1
				} else {
					setIsPlaying(false)
					return
				}
				break
			case 'list-loop':
				// 列表循环：循环到开头
				nextIndex = (currentIndex + 1) % musicList.length
				break
			case 'list-no-loop':
				// 列表不循环：到末尾停止
				if (currentIndex < musicList.length - 1) {
					nextIndex = currentIndex + 1
				} else {
					setIsPlaying(false)
					return
				}
				break
		}

		playMusic(nextIndex)
	},

	// 播放上一首
	playPrev: () => {
		const { musicList, currentIndex, loopMode, playMusic, progress, setProgress } = get()
		if (musicList.length === 0) return

		// 如果播放进度超过 3 秒，重新播放当前歌曲
		if (progress > 3) {
			setProgress(0)
			return
		}

		let prevIndex = currentIndex

		switch (loopMode) {
			case 'single-loop':
				// 单曲循环：不改变索引
				break
			case 'list-loop':
				// 列表循环：循环到末尾
				prevIndex = (currentIndex - 1 + musicList.length) % musicList.length
				break
			case 'single-no-loop':
			case 'list-no-loop':
				// 不循环：只在非第一首时切换
				if (currentIndex > 0) {
					prevIndex = currentIndex - 1
				}
				break
		}

		playMusic(prevIndex)
	},

	// 从 API 获取音乐列表
	fetchMusicList: async () => {
		try {
			const response = await fetch('/api/music')
			const data = await response.json()
			if (data.success && data.music) {
				set({ musicList: data.music })
				const { currentIndex } = get()
				// 自动选中第一首
				if (currentIndex === -1 && data.music.length > 0) {
					set({ currentIndex: 0 })
				}
			}
		} catch (error) {
			console.error('Failed to fetch music list:', error)
		}
	}
}))

// 客户端初始化：恢复保存的音量和循环模式
if (typeof window !== 'undefined') {
	const savedVolume = localStorage.getItem('music-player-volume')
	if (savedVolume) {
		useMusicPlayerStore.setState({ volume: parseFloat(savedVolume) })
	}

	const savedLoopMode = localStorage.getItem('music-player-loop-mode') as LoopMode
	if (savedLoopMode && LOOP_MODES.includes(savedLoopMode)) {
		useMusicPlayerStore.setState({ loopMode: savedLoopMode })
	}
}
