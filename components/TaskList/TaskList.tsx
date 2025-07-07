import {
  Checkbox,
  ListItem,
  UnorderedList,
  IconButton,
  Spacer,
  HStack,
  Divider,
  Flex,
  useToast,
  Editable,
  EditableInput,
  EditablePreview,
} from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'
import { deleteTask } from '../Task/Functions/deleteTask'
import { editTask } from '../Task/Functions/editTask'
import { completedTask } from '../Task/Functions/completedTask'
import useSWR from 'swr'
import { useTaskStore } from '@/store'
import JSConfetti from 'js-confetti'
import { FC, useMemo } from 'react'
import type { Task } from '@/types/Task'

interface TaskListProps {
  tasks: Task[]
}

const TaskList: FC<TaskListProps> = ({ tasks }) => {
  const toast = useToast()
  const funMode = useTaskStore((state) => state.funMode)
  const searchTerm = useTaskStore((state) => state.searchTerm)

  // Instantiate JSConfetti only once
  const confetti = useMemo(() => new JSConfetti(), [])

  // Use the bound mutate from useSWR
  const { mutate } = useSWR('/api/tasks')

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes((searchTerm || '').toLowerCase()),
  )

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId)
      mutate()

      toast({
        title: 'Task deleted',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      mutate()
      toast({
        title: 'Error deleting task',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const handleEditTask = async (taskId: string, nextValue: string) => {
    try {
      mutate((data?: Task[]) => {
        if (!data) return data

        return data.map((task) =>
          task._id === taskId ? { ...task, title: nextValue } : task,
        )
      }, false)

      // Make the actual API call
      await editTask(taskId, nextValue)

      // Success feedback
      toast({
        title: 'Task updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      // Revalidate on error
      mutate()

      toast({
        title: 'Error updating task',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })

      console.error('Error editing task:', error)
    }
  }

  const handleCompletedTask = async (taskId: string) => {
    try {
      await mutate((data?: Task[]) => {
        if (!data) return data

        return data.map((task) =>
          task._id === taskId ? { ...task, completed: !task.completed } : task,
        )
      }, false)

      const result = await completedTask(taskId)

      if (!result) {
        throw new Error('No response from server')
      }

      if (typeof result.completed === 'undefined') {
        console.error('Result object:', result) // ✅ Log completo
        throw new Error('Invalid task data: completed property missing')
      }

      // Show feedback only when task is completed
      if (result.completed) {
        if (funMode) {
          confetti.addConfetti({
            emojis: ['🌈', '🐻', '✏️', '✅', '🥳', '🎉', '🦄', '🐻', '🐼'],
            emojiSize: 150,
            confettiRadius: 100,
          })
        } else {
          toast({
            title: 'Task Done',
            status: 'success',
            duration: 5000,
            isClosable: true,
          })
        }
      }
    } catch (error) {
      // Revert optimistic update on error
      mutate()

      toast({
        title: 'Error completing task',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  return (
    <UnorderedList styleType="none" spacing={2} marginTop={5}>
      {filteredTasks.map((task) => (
        <ListItem key={task._id}>
          <Flex alignItems="center">
            <HStack spacing="12px">
              <Checkbox
                colorScheme="teal"
                isChecked={task.completed}
                onChange={() => handleCompletedTask(task._id)}
              />

              <Editable
                defaultValue={task.title}
                onSubmit={(nextValue) => handleEditTask(task._id, nextValue)}
              >
                <EditablePreview as={task.completed ? 'del' : 'span'} />
                <EditableInput _focus={{ borderColor: 'teal.400' }} />
              </Editable>
            </HStack>
            <Spacer />
            <IconButton
              aria-label="Delete a task"
              size="xs"
              color="red.300"
              margin="10px"
              icon={<DeleteIcon />}
              onClick={() => handleDeleteTask(task._id)}
            />
          </Flex>
          <Divider />
        </ListItem>
      ))}
    </UnorderedList>
  )
}

export default TaskList
