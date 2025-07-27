import mongoose from "mongoose";

const FileSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    revisionId: { type: mongoose.Schema.Types.ObjectId, ref: "Revision", required: true, index: true },

    path: { type: String, required: true }, // e.g. "src/components/PricingTable.jsx"
    code: { type: String, required: true },

    // convenience
    isEntry: { type: Boolean, default: false }, // e.g. index.jsx
  },
  { timestamps: true }
);

FileSchema.index({ projectId: 1, revisionId: 1, path: 1 }, { unique: true });

export default mongoose.model("File", FileSchema);
