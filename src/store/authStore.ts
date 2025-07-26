import { create } from 'zustand';
import { AuthState } from '@/types';

interface AuthStore extends AuthState {
  setAuthenticated: (authenticated: boolean) => void;
  setUser: (user: AuthState['user']) => void;
  setTokens: (tokens: AuthState['tokens']) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  user: undefined,
  tokens: undefined,
  
  setAuthenticated: (authenticated: boolean) =>
    set({ isAuthenticated: authenticated }),
    
  setUser: (user: AuthState['user']) =>
    set({ user }),
    
  setTokens: (tokens: AuthState['tokens']) =>
    set({ tokens }),
    
  signOut: () =>
    set({
      isAuthenticated: false,
      user: undefined,
      tokens: undefined,
    }),
}));