// /controllers/codeController.js
import Project from '../models/Project.js';
import { generateComponent, modifyComponent } from '../services/codegen.js';
import { createProjectZip } from '../services/zip.js';

export async function generateCode(req, res) {
  try {
    const { projectId, prompt, settings } = req.body;
    const data = await generateComponent({
      projectId,
      prompt,
      settings,
      userId: req.user._id,
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function modifyCode(req, res) {
  try {
    const { projectId, filePath, nodeId, instruction } = req.body;
    const data = await modifyComponent({
      projectId,
      filePath,
      nodeId,
      instruction,
      userId: req.user._id,
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}



export async function downloadCodeZip(req, res) {
  try {
    const { projectId } = req.params;

    // Check project ownership
    const project = await Project.findOne({
      _id: projectId,
      userId: req.user._id,
    });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const zipUrl = await createProjectZip({
      projectId,
      revisionId: project.currentRevisionId,
    });

    res.json({ url: zipUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

