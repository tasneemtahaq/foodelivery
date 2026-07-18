import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthUser {
  id:    number;
  name?: string;
  email: string;
  role:  "admin" | "customer";
}

interface AuthStore {
  user:         AuthUser | null;
  isLoggedIn:   boolean;
  login:        (user: AuthUser) => void;
  logout:       () => void;
  hasHydrated:  boolean;
  setHydrated:  () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user:        null,
      isLoggedIn:  false,
      hasHydrated: false,

      login: (user) => set({ user, isLoggedIn: true }),

      logout: () => set({ user: null, isLoggedIn: false }),

      setHydrated: () => set({ hasHydrated: true }),
    }),
    {
      name: "auth-store",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);