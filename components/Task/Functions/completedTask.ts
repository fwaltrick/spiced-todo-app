export const completedTask = async (taskId: string) => {
  try {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error in completedTask function:', error)
    throw error
  }
}
