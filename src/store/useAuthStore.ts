import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Role = 'admin' | 'empleado' | 'cajero'

interface User {
  id: number
  nombre: string
  email: string
}

interface AuthState {
  user: User | null
  token: string | null
  rol: Role | null
  login: (user: User, token: string, rol: Role) => void
  logout: () => void
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      rol: null,
      login: (user, token, rol) => set({ user, token, rol }),
      logout: () => set({ user: null, token: null, rol: null }),
    }),
    {
      name: 'auth-storage',
    },
  ),
)

export default useAuthStore
