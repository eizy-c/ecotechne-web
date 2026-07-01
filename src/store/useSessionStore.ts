import { create } from 'zustand';

type UserSession = {
  user_id: number;
  name: string;
  email: string;
  permissions: string[];
} | null;

interface SessionState {
  user: UserSession;
  setUser: (user: UserSession) => void;
  hasPermission: (permission: string) => boolean;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),
  hasPermission: (permission) => {
    const user = get().user;
    if (!user) return false;
    // admin (role_id=1) generally has all permissions, but for safety we check the array
    return user.permissions.includes(permission);
  },
}));
