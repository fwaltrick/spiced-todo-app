export async function editTask(
  taskId: string,
  taskTitle: string,
): Promise<void> {
  try {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: taskTitle }),
    })

    if (!response.ok) {
      throw new Error(`Failed to edit task: ${response.status}`)
    }
  } catch (error) {
    console.error('Error editing task:', error)
    throw error // Re-throw para o componente tratar
  }
}
