import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserData {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER'; // Define roles explicitly
}

interface AuthState {
  isLoggedIn: boolean;
  user: UserData | null; // Store user data
  login: (userData: UserData) => void; // Login now accepts user data
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      login: (userData) => {
        // Set localStorage (persist) and also cookie for middleware
        document.cookie = `auth-store=${encodeURIComponent(JSON.stringify({ state: { isLoggedIn: true, user: userData } }))}; path=/`;
        set({ isLoggedIn: true, user: userData });
      },
      logout: () => {
        // Clear cookie
        document.cookie = `auth-store=; path=/; max-age=0`;
        // Clear Zustand state & localStorage via persist
        set({ isLoggedIn: false, user: null });
      },
    }),
    {
      name: 'auth-store',
    }
  )
);