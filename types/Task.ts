import { Document } from 'mongoose'

export interface Task {
  _id: string
  title: string
  completed: boolean
  created_at: string | Date
  updated_at: string | Date
}
