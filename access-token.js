import mongoose, { Schema, Types } from "mongoose";

const AccessTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    isRevoked: {
      type: Boolean,
      required: false,
      default: false,
    },
    expiresAt: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const AccessTokens = mongoose.model("access_tokens", AccessTokenSchema);

export default AccessTokens;
