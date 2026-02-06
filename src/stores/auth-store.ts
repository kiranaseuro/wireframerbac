import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User, UserRole } from "@/types"
import { demoUsers, initializeMockData } from "@/lib/mock-data"

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  mockData: ReturnType<typeof initializeMockData>
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  switchRole: (role: UserRole) => void
  initializeData: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      mockData: initializeMockData(),

      initializeData: () => {
        const mockData = initializeMockData()
        set({ mockData })
      },

      login: async (email: string, password: string) => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Find user by email
        const user = demoUsers.find((u) => u.email === email)

        if (!user) {
          throw new Error("Invalid credentials")
        }

        set({
          user: { ...user, lastLogin: new Date() },
          isAuthenticated: true,
        })
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        })
        localStorage.removeItem("auth-storage")
      },

      switchRole: (role: UserRole) => {
        const { user } = get()
        if (!user) return

        // Find demo user with the target role
        const demoUser = demoUsers.find((u) => u.userRole === role)
        if (demoUser) {
          set({
            user: { ...demoUser, lastLogin: new Date() },
          })
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
