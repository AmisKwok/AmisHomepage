/**
 * 特效状态管理 Store
 * 仅在网站打开期间生效，不持久化到 localStorage
 * 每次刷新页面都会重置为配置文件的默认值
 */
import { create } from 'zustand'

interface EffectsStore {
  effectsEnabled: boolean
  toggleEffects: () => void
  setEffectsEnabled: (enabled: boolean) => void
}

export const useEffectsStore = create<EffectsStore>((set, get) => ({
  effectsEnabled: true,
  
  toggleEffects: () => {
    set({ effectsEnabled: !get().effectsEnabled })
  },
  
  setEffectsEnabled: (enabled) => {
    set({ effectsEnabled: enabled })
  }
}))
