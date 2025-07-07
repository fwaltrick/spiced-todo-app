import { useTaskStore } from '@/store'
import { FormControl, FormLabel, Switch } from '@chakra-ui/react'
import { FC } from 'react'

const FunMode: FC = () => {
  const [funMode, toggleFunMode] = useTaskStore((state) => [
    state.funMode,
    state.toggleFunMode,
  ])

  return (
    <FormControl
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <FormLabel htmlFor="fun-mode" mb="0">
        Fun Mode
      </FormLabel>
      <Switch
        colorScheme="teal"
        id="fun-mode"
        isChecked={funMode}
        onChange={toggleFunMode}
      />
    </FormControl>
  )
}

export default FunMode
