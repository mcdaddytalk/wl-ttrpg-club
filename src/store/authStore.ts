import { create } from 'zustand';
import { 
    devtools, 
    persist, 
} from 'zustand/middleware';
import { User } from '@supabase/supabase-js';

interface AuthState {
    user: User | null;
    roles: string[];
    isAuthenticated: boolean;
    login: (user: User) => void;
    logout: () => void;
    updateRoles: (roles: string[]) => void;  
}

export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            (set) => ({
                user: null,
                roles: [],
                isAuthenticated: false,
                login: (user: User) => {
                    set({ user, isAuthenticated: true });
                },
                logout: () => {
                    set({ user: null, isAuthenticated: false });
                },
                updateRoles: (roles: string[]) => {
                    set({ roles });
                },
            }),
            {
                name: 'auth-storage',
            }
        )
    )
);
