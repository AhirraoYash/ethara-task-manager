import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  mobile: string;
  email?: string;
  role: 'Admin' | 'Member';
  password?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    email: { type: String, unique: true, sparse: true },
    role: { type: String, enum: ['Admin', 'Member'], default: 'Member' },
    password: { type: String }, // Hashed password
  },
  { timestamps: true }
);

// Hash the password before saving
UserSchema.pre<IUser>('save', async function () {
  if (!this.isModified('password') || !this.password) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);
