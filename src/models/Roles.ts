import mongoose from 'mongoose';

const RoleSchema = new mongoose.Schema({
  value: { type: String, required: true, default: 'USER' },
});

export interface RoleType extends mongoose.Document {
  value: string;
}

export const Role = mongoose.model<RoleType>('Role', RoleSchema);
