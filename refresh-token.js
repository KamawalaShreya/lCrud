import mongoose, { Schema, Types } from "mongoose";

const RefreshTokenSchema = new mongoose.Schema(
  {
    refreshToken: {
      type: String,
      required: true,
    },
    accessTokenJti: {
      type: String,
      required: true,
    },
    isRevoked: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const RefreshTokens = mongoose.model("refresh_tokens", RefreshTokenSchema);

export default RefreshTokens;
