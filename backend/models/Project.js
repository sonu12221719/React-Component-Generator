import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: String,

    // points to the latest revision for quick reads
    currentRevisionId: { type: mongoose.Schema.Types.ObjectId, ref: "Revision" },
  },
  { timestamps: true }
);

export default mongoose.model("Project", ProjectSchema);
