import { Input, InputLeftElement, InputGroup } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import AddTask from './Functions/addTask'
import { useSWRConfig } from 'swr'
import { FormEvent } from 'react'

interface AddTaskInputProps {
  afterSubmit?: () => void
}

export default function AddTaskInput({ afterSubmit }: AddTaskInputProps) {
  const { mutate } = useSWRConfig()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)
    const title = formData.get('title')?.toString() || ''

    try {
      await AddTask({ title })
      mutate('/api/tasks')

      const form = event.target as HTMLFormElement
      const inputElement = form.elements.namedItem('title') as HTMLInputElement
      inputElement && inputElement.focus()

      form.reset()

      if (afterSubmit) {
        afterSubmit()
      }
    } catch (error) {
      console.error('Error adding task:', error)
    } finally {
      mutate('/api/tasks')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <AddIcon color="gray.300" />
        </InputLeftElement>
        <Input
          aria-label="add New Task"
          focusBorderColor="teal.400"
          autoFocus
          id="title"
          name="title"
          type="text"
          placeholder="Add new task"
        />
      </InputGroup>
    </form>
  )
}
