import { create, StateCreator } from 'zustand';
import { 
    devtools, 
    persist, 
    /// PersistOptions, 
    PersistStorage, 
    StorageValue 
} from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

type ToastStore = {
    showToast: boolean;
    toastId: string | null;
    type: string | null;
    message: string | null;
    setToast: (type: string, message: string, id?: string) => void;
    resetToast: () => void;
}

const createCustomStorage = (): PersistStorage<ToastStore> => {
    return {
      getItem: (name: string) => {
        try {
          if (typeof window === 'undefined') {
            return null; // Avoid SSR issues
          }
          const value = localStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        } catch (error) {
          console.error('Error accessing localStorage', error);
          return null;
        }
      },
      setItem: (name: string, value: StorageValue<ToastStore>) => {
        try {
          if (typeof window !== 'undefined') {
            localStorage.setItem(name, JSON.stringify(value));
          }
        } catch (error) {
          console.error('Error setting localStorage', error);
        }
      },
      removeItem: (name: string) => {
        try {
          if (typeof window !== 'undefined') {
            localStorage.removeItem(name);
          }
        } catch (error) {
          console.error('Error removing localStorage item', error);
        }
      },
    };
  };

const toastMiddleWare = (f: StateCreator<ToastStore>) => devtools(persist(f, { name: 'toast-storage', storage: createCustomStorage() }));

const useToastStore = create<ToastStore>()(
    toastMiddleWare((set) => ({
                showToast: false,
                toastId: null,
                type: null,
                message: null,
                setToast: (type: string, message: string, id?: string) => {
                    const toastId = id || uuidv4();
                  // console.log(`TOAST MESSAGE:  ${type} - ${message}`)
                    set({ showToast: true, toastId, type, message })
                },
                resetToast: () => set({ showToast: false, toastId: null, type: null, message: null }),
            })
    )
);

export default useToastStore;