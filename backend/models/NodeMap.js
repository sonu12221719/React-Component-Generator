import mongoose from "mongoose";

const NodeMapSchema = new mongoose.Schema(
  {
    revisionId: { type: mongoose.Schema.Types.ObjectId, ref: "Revision", required: true, index: true },
    filePath: { type: String, required: true },

    // one doc per file per revision, storing all nodes
    nodes: [
      {
        nodeId: { type: String, required: true }, // the uuid you inject into JSX as data-node-id
        start: { type: Number, required: true },
        end: { type: Number, required: true },
        type: { type: String, required: true }, // e.g. "JSXElement"
      },
    ],
  },
  { timestamps: true }
);

NodeMapSchema.index({ revisionId: 1, filePath: 1 });

export default mongoose.model("NodeMap", NodeMapSchema);
