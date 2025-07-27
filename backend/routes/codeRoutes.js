// /routes/codeRoutes.js
import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { generateCode, modifyCode, downloadCodeZip } from '../controllers/codeController.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/generate', generateCode);
router.post('/modify', modifyCode);
router.get('/download/:projectId', downloadCodeZip);

export default router;
