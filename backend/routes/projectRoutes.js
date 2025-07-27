// /routes/projectRoutes.js
import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import {
  createProject,
  getProjects,
  getProjectById,
  deleteProject,
} from '../controllers/projectController.js';

const router = express.Router();

router.use(authMiddleware); // all project routes are protected

router.get('/', getProjects);
router.post('/', createProject);
router.get('/:id', getProjectById);
router.delete('/:id', deleteProject);

export default router;
