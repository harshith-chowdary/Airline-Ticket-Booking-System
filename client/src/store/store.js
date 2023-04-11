import { create } from 'zustand';

export const useAuthStore = create((set, get) => ({
    auth : {
        username : '',
        active : false
    },
    setUsername : (name) => set((state) => ({ auth : { ...state.auth, username : name, active : true}})) ,
    isAuthenticated: () => {
        const { auth } = get();
        return auth.active;
      },
}))