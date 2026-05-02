import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description: string;
  project: mongoose.Types.ObjectId;
  assignedTo: mongoose.Types.ObjectId;
  status: 'Pending' | 'In Progress' | 'Completed';
}

const TaskSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

export const Task = mongoose.model<ITask>('Task', TaskSchema);
