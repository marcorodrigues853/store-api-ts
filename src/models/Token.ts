import mongoose, { Schema } from 'mongoose';

const TokenSchema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, Ref: 'User', required: true },
    refreshToken: { type: String, required: true },
  },
  { timestamps: true },
);

export interface TokenType extends mongoose.Document {
  refreshToken: string;
}

export const Token = mongoose.model<TokenType>('Token', TokenSchema);
