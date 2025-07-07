import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/db/connect'
import Task from '@/db/models/Task'

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  await dbConnect()

  if (request.method === 'GET') {
    try {
      const tasks = await Task.find().sort('-created_at')
      return response.status(200).json(tasks)
    } catch (error) {
      console.error('Error fetching tasks:', error)
      return response.status(500).json({ error: 'Failed to fetch tasks' })
    }
  }

  if (request.method === 'POST') {
    try {
      const taskTitle = request.body
      const task = new Task(taskTitle)
      const record = await task.save()
      return response.status(201).json(record)
    } catch (error) {
      console.error('Error creating task:', error)
      return response.status(400).json({
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  // Handle unsupported methods
  return response.status(405).json({ error: 'Method not allowed' })
}
