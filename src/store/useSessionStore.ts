import { create } from 'zustand';

type UserSession = {
  user_id?: number;
  id?: number;
  name?: string;
  email: string;
  role?: string;
  permissions: string[];
} | null;

interface SessionState {
  user: UserSession;
  unreadCount: number;
  isSidebarOpen: boolean;
  setUser: (user: UserSession) => void;
  setUnreadCount: (count: number) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  hasPermission: (permission: string) => boolean;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  user: null,
  unreadCount: 0,
  isSidebarOpen: false,
  setUser: (user) => set({ user }),
  setUnreadCount: (count) => set({ unreadCount: count }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  hasPermission: (permission) => {
    const user = get().user;
    if (!user) return false;
    
    // Permiso supremo
    if (user.permissions.includes('manage:all')) return true;
    
    return user.permissions.includes(permission);
  },
}));
