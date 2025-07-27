import mongoose from "mongoose";

const RevisionSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    parentRevisionId: { type: mongoose.Schema.Types.ObjectId, ref: "Revision" },

    createdBy: { type: String, enum: ["user", "llm"], default: "llm" },
    message: String, // e.g. "Initial generation", "Changed CTA color"

    // Optional: store some quick stats
    filesChanged: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Revision", RevisionSchema);
