import mongoose, { Schema } from "mongoose";

const TokenSchema = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, Ref: "User" },
  refreshToken: { type: String, required: true },
});

export interface TokenType extends mongoose.Document {
  refreshToken: string;
}

export const Token = mongoose.model<TokenType>("Token", TokenSchema);