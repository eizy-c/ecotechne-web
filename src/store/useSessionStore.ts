import { create } from 'zustand';

type UserSession = {
  user_id: number;
  name: string;
  email: string;
  permissions: string[];
} | null;

interface SessionState {
  user: UserSession;
  unreadCount: number;
  setUser: (user: UserSession) => void;
  setUnreadCount: (count: number) => void;
  hasPermission: (permission: string) => boolean;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  user: null,
  unreadCount: 0,
  setUser: (user) => set({ user }),
  setUnreadCount: (count) => set({ unreadCount: count }),
  hasPermission: (permission) => {
    const user = get().user;
    if (!user) return false;
    // admin (role_id=1) generally has all permissions, but for safety we check the array
    return user.permissions.includes(permission);
  },
}));
