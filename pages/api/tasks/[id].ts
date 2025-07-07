import type { NextApiRequest, NextApiResponse } from 'next'
import Task from '@/db/models/Task'
import dbConnect from '@/db/connect'

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { id } = request.query

  if (!id || typeof id !== 'string') {
    return response.status(400).json({ error: 'Invalid ID' })
  }

  await dbConnect()

  try {
    switch (request.method) {
      case 'DELETE':
        await Task.findByIdAndDelete(id)
        return response.status(200).json({ message: 'Success!' })

      case 'PUT':
        const existingTask = await Task.findById(id)
        if (!existingTask) {
          return response.status(404).json({ status: 'Task not found' })
        }

        await Task.findByIdAndUpdate(id, {
          $set: { title: request.body.title },
        })

        return response.status(200).json({
          status: `Task ${id} was successfully edited!`,
        })

      case 'PATCH':
        let task = await Task.findById(id)
        if (!task) {
          return response.status(404).json({ status: 'Task not found' })
        }

        task = await Task.findByIdAndUpdate(
          id,
          {
            $set: { completed: !task.completed },
          },
          { new: true },
        )

        return response.status(200).json(task)

      default:
        return response.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('API Error:', error)
    return response.status(500).json({ error: 'Internal server error' })
  }
}
