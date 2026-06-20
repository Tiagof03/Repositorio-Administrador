import { create } from 'zustand'

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected'

interface WSStore {
  status: ConnectionStatus
  lastEvent: string | null
  reconnectAttempts: number
  setStatus: (status: ConnectionStatus) => void
  setLastEvent: (event: string | null) => void
  incrementReconnect: () => void
  resetReconnect: () => void
}

const useWsStore = create<WSStore>((set) => ({
  status: 'disconnected',
  lastEvent: null,
  reconnectAttempts: 0,
  setStatus: (status) => set({ status }),
  setLastEvent: (lastEvent) => set({ lastEvent }),
  incrementReconnect: () => set((s) => ({ reconnectAttempts: s.reconnectAttempts + 1 })),
  resetReconnect: () => set({ reconnectAttempts: 0 }),
}))

export default useWsStore
