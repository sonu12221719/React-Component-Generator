// controllers/revisionController.js
import Revision from "../models/Revision.js";
import File from "../models/File.js";
import NodeMap from "../models/NodeMap.js";

export const getRevisionById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching revision details for ID:", id);

    // Check if id is valid
    if (!id || id === 'undefined' || id === 'null') {
      return res.status(400).json({ error: "Invalid revision ID" });
    }

    const revision = await Revision.findById(id);
    if (!revision) {
      return res.status(404).json({ error: "Revision not found" });
    }

    const files = await File.find({ revisionId: id });
    const nodeMaps = await NodeMap.find({ revisionId: id });

    res.json({
      revision,
      files,
      nodeMaps,
    });
  } catch (err) {
    console.error("Error fetching revision details:", err);
    res.status(500).json({ error: "Server error" });
  }
};
