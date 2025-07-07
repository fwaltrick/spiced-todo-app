import { Task } from '@/types/Task'

export interface TaskStore {
  // State
  funMode: boolean
  setupMode: boolean
  activeList: string | null
  searchTerm: string
  countingTasks: Task[]
  countCompletedTasks: number
  countActiveTasks: number

  // Actions
  finishSetup: () => void
  setActiveList: (newActiveList: string) => void
  setSearchTerm: (newSearchTerm: string) => void
  toggleFunMode: () => void
  setCountingTasks: (newCountingTasks: Task[]) => void
  setCountCompletedTasks: () => void
  setActiveTasks: () => void
  updateTaskCounts?: () => void
}
