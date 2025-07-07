import React from 'react'
import TaskList from './TaskList'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ChakraProvider } from '@chakra-ui/react'
import { Task } from '@/types/Task'
import { useTaskStore } from '@/store'

jest.mock('@/store')
const mockedUseTaskStore = useTaskStore as unknown as jest.Mock

jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  useToast: () => jest.fn(),
}))

jest.mock('../Task/Functions/completedTask', () => ({
  completedTask: jest.fn(() => Promise.resolve({ completed: true })),
}))

jest.mock('../Task/Functions/deleteTask', () => ({
  deleteTask: jest.fn(() => Promise.resolve()),
}))

jest.mock('../Task/Functions/editTask', () => ({
  editTask: jest.fn(() => Promise.resolve()),
}))

jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    mutate: jest.fn(),
  })),
}))

jest.mock('js-confetti', () => {
  return jest.fn().mockImplementation(() => ({
    addConfetti: jest.fn(),
  }))
})

const tasks: Task[] = [
  {
    _id: '1',
    title: 'Task 1',
    completed: false,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  {
    _id: '2',
    title: 'Task 2',
    completed: false,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  {
    _id: '3',
    title: 'Task 3',
    completed: false,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
]

const renderWithChakra = (component: React.ReactElement) => {
  return render(<ChakraProvider>{component}</ChakraProvider>)
}

describe('view a list of tasks', () => {
  beforeEach(() => {
    mockedUseTaskStore.mockClear()

    const mockState = {
      funMode: false,
      searchTerm: '',
    }

    mockedUseTaskStore.mockImplementation((selector) => selector(mockState))
  })

  it('render the tasklist', () => {
    renderWithChakra(<TaskList tasks={tasks} />)

    expect(screen.getByText('Task 1')).toBeInTheDocument()

    const listItems = screen.getAllByRole('listitem')
    expect(listItems.length).toBe(3)
  })

  it('handles completed task correctly', () => {
    renderWithChakra(<TaskList tasks={tasks} />)

    const checkboxes = screen.getAllByRole('checkbox')

    fireEvent.click(checkboxes[0])

    expect(checkboxes[0]).toBeInTheDocument()
  })

  it('handles delete task correctly', () => {
    renderWithChakra(<TaskList tasks={tasks} />)

    const listItems = screen.getAllByRole('listitem')
    expect(listItems.length).toBe(3)

    const deleteButtons = screen.getAllByRole('button', {
      name: 'Delete a task',
    })
    fireEvent.click(deleteButtons[0])

    expect(deleteButtons[0]).toBeInTheDocument()
  })
})
