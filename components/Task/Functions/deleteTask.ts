export async function deleteTask(taskId: string): Promise<void> {
  try {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error(`Failed to delete task: ${response.status}`)
    }
  } catch (error) {
    console.error('Error deleting task:', error)
    throw error // Re-throw para o componente tratar
  }
}
