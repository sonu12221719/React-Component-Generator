import mongoose from "mongoose";

const RunSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

    type: { type: String, enum: ["generate", "modify"], required: true },

    // telemetry / cost tracking
    promptTokens: { type: Number, default: 0 },
    completionTokens: { type: Number, default: 0 },
    cost: { type: Number, default: 0 },

    status: { type: String, enum: ["ok", "error"], default: "ok" },
    errorMessage: String,
  },
  { timestamps: true }
);

export default mongoose.model("Run", RunSchema);
