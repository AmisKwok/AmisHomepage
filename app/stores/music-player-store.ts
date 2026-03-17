import { create } from 'zustand'

export type LoopMode = 'list-loop' | 'list-no-loop' | 'single-loop' | 'single-no-loop'

export interface Music {
	id: string
	name: string
	path: string
	order: number
}

interface MusicPlayerStore {
	musicList: Music[]
	currentIndex: number
	isPlaying: boolean
	loopMode: LoopMode
	volume: number
	progress: number
	duration: number
	isExpanded: boolean
	showPlaylist: boolean
	isLoading: boolean
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

const LOOP_MODES: LoopMode[] = ['list-loop', 'list-no-loop', 'single-loop', 'single-no-loop']

export const useMusicPlayerStore = create<MusicPlayerStore>((set, get) => ({
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

	setMusicList: (list) => set({ musicList: list }),
	setCurrentIndex: (index) => set({ currentIndex: index }),
	setIsPlaying: (playing) => set({ isPlaying: playing }),
	setLoopMode: (mode) => {
		localStorage.setItem('music-player-loop-mode', mode)
		set({ loopMode: mode })
	},
	setVolume: (volume) => {
		localStorage.setItem('music-player-volume', volume.toString())
		set({ volume })
	},
	setProgress: (progress) => set({ progress }),
	setDuration: (duration) => set({ duration }),
	toggleExpand: () => set((state) => ({ isExpanded: !state.isExpanded })),
	togglePlaylist: () => set((state) => ({ showPlaylist: !state.showPlaylist })),
	setIsLoading: (loading) => set({ isLoading: loading }),

	playMusic: (index) => {
		const { musicList } = get()
		if (index >= 0 && index < musicList.length) {
			set({ currentIndex: index, isPlaying: true })
		}
	},

	togglePlay: () => {
		const { musicList, currentIndex, isPlaying, playMusic } = get()
		if (currentIndex === -1 && musicList.length > 0) {
			playMusic(0)
			return
		}
		set({ isPlaying: !isPlaying })
	},

	playNext: () => {
		const { musicList, currentIndex, loopMode, playMusic, setIsPlaying } = get()
		if (musicList.length === 0) return

		let nextIndex = currentIndex

		switch (loopMode) {
			case 'single-loop':
				break
			case 'single-no-loop':
				if (currentIndex < musicList.length - 1) {
					nextIndex = currentIndex + 1
				} else {
					setIsPlaying(false)
					return
				}
				break
			case 'list-loop':
				nextIndex = (currentIndex + 1) % musicList.length
				break
			case 'list-no-loop':
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

	playPrev: () => {
		const { musicList, currentIndex, loopMode, playMusic, progress, setProgress } = get()
		if (musicList.length === 0) return

		if (progress > 3) {
			setProgress(0)
			return
		}

		let prevIndex = currentIndex

		switch (loopMode) {
			case 'single-loop':
				break
			case 'list-loop':
				prevIndex = (currentIndex - 1 + musicList.length) % musicList.length
				break
			case 'single-no-loop':
			case 'list-no-loop':
				if (currentIndex > 0) {
					prevIndex = currentIndex - 1
				}
				break
		}

		playMusic(prevIndex)
	},

	fetchMusicList: async () => {
		try {
			const response = await fetch('/api/music')
			const data = await response.json()
			if (data.success && data.music) {
				set({ musicList: data.music })
				const { currentIndex } = get()
				if (currentIndex === -1 && data.music.length > 0) {
					set({ currentIndex: 0 })
				}
			}
		} catch (error) {
			console.error('Failed to fetch music list:', error)
		}
	}
}))

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
