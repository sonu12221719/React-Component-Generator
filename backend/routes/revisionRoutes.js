import express from 'express';
import { getRevisionById } from '../controllers/revisionController.js';
// import { authmiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/:id', getRevisionById);

export default router;
