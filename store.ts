import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Task } from '@/types/Task'
import type { TaskStore } from '@/types/TaskStore'

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      funMode: false,
      setupMode: true,

      finishSetup: () => set({ setupMode: false }),
      activeList: null,

      setActiveList: (newActiveList: string) =>
        set({ activeList: newActiveList }),
      searchTerm: '',

      setSearchTerm: (newSearchTerm: string) =>
        set({ searchTerm: newSearchTerm }),

      toggleFunMode: () =>
        set((state) => ({
          funMode: !state.funMode,
        })),
      countingTasks: [],
      setCountingTasks: (newCountingTasks: Task[]) =>
        set({ countingTasks: newCountingTasks }),
      countCompletedTasks: 0,
      countActiveTasks: 0,

      setCountCompletedTasks: () =>
        set((state) => ({
          countCompletedTasks: state.countingTasks.reduce(
            (count, task) => (task.completed ? count + 1 : count),
            0,
          ),
        })),

      setActiveTasks: () =>
        set((state) => {
          const countCompleted = state.countingTasks.reduce(
            (count, task) => (task.completed ? count + 1 : count),
            0,
          )
          return {
            countActiveTasks: state.countingTasks.length - countCompleted,
          }
        }),
    }),
    {
      name: 'task-tango-storage',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
          return window.localStorage
        }

        // ✅ Fallback para quando localStorage não está disponível
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
      }),
      // ✅ Previne hydration mismatch
      skipHydration: true,
    },
  ),
)
