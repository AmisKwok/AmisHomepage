import { create } from 'zustand'
import type { SiteContent } from '../../types'

interface ConfigStore {
	siteContent: SiteContent | null
	setSiteContent: (content: SiteContent) => void
}

export const useConfigStore = create<ConfigStore>((set) => ({
	siteContent: null,

	setSiteContent: (content: SiteContent) => {
		set({ siteContent: content })
	}
}))
