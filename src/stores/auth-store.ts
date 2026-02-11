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
  autoLogin: () => void
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

      login: async (email: string, _password: string) => {
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

      autoLogin: () => {
        // Check if user already exists (restored from localStorage by persist middleware)
        const { user, isAuthenticated } = get()

        // Only auto-login if there's no existing user session
        // This allows role switching to persist across page reloads
        if (user && isAuthenticated) {
          console.log("✅ User session restored:", user.fullName, "-", user.userRole)
          return // User already logged in, don't override
        }

        // First-time login: Auto-login as alice.admin@fmg.com (IT_ADMIN role)
        console.log("🔐 Auto-login: Setting default user (IT_ADMIN)")
        const itAdmin = demoUsers.find((u) => u.email === "alice.admin@fmg.com")
        if (itAdmin) {
          set({
            user: { ...itAdmin, lastLogin: new Date() },
            isAuthenticated: true,
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
