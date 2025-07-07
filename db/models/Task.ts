import mongoose, { Schema } from 'mongoose'

const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    completed: { type: Boolean, required: true, default: false },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
)

const TaskModel = mongoose.models.Task || mongoose.model('Task', taskSchema)

export default TaskModel
