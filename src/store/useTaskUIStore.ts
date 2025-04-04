import { create } from 'zustand';

interface TaskUIState {
  selectedTaskId: string | null;
  isDetailsOpen: boolean;
  isFormOpen: boolean;

  setSelectedTaskId: (id: string | null) => void;
  openDetails: () => void;
  closeDetails: () => void;

  openForm: () => void;
  closeForm: () => void;
  toggleForm: () => void;
}

export const useTaskUIStore = create<TaskUIState>((set) => ({
  selectedTaskId: null,
  isDetailsOpen: false,
  isFormOpen: false,

  setSelectedTaskId: (id) => set({ selectedTaskId: id }),
  openDetails: () => set({ isDetailsOpen: true }),
  closeDetails: () => set({ isDetailsOpen: false }),

  openForm: () => set({ isFormOpen: true }),
  closeForm: () => set({ isFormOpen: false }),
  toggleForm: () => set((state) => ({ isFormOpen: !state.isFormOpen })),
}));
