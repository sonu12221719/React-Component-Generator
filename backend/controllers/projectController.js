// /controllers/projectController.js
import Project from '../models/Project.js';

export async function createProject(req, res) {
  try {
    const { name, description } = req.body;
    const project = await Project.create({
      userId: req.user._id,
      name,
      description,
    });
    
    // Return the project with a flag indicating it needs initial setup
    res.status(201).json({
      ...project.toObject(),
      needsInitialSetup: true
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getProjects(req, res) {
  try {
    const projects = await Project.find({ userId: req.user._id });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getProjectById(req, res) {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user._id });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    
    // If project has no currentRevisionId, return with empty revision info
    if (!project.currentRevisionId) {
      return res.json({
        ...project.toObject(),
        currentRevisionId: null,
        hasRevision: false
      });
    }
    
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteProject(req, res) {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
