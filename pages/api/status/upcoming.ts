import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/db/connect'
import TaskModel from '@/db/models/Task'
import { Task } from '@/types/Task'

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<Task[] | { error: string }>,
) {
  await dbConnect()

  if (request.method === 'GET') {
    const tasks = await TaskModel.find({ completed: false }).sort('-created_at')
    return response.status(200).json(tasks)
  }

  response.setHeader('Allow', ['GET'])
  return response
    .status(405)
    .json({ error: `Method ${request.method} not allowed` })
}
