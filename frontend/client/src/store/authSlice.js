import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  // state
  user: null,

  // actions
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null })
}))