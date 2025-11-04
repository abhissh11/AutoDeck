import express from 'express';
import { generateSlides, editSlides, generatePPT, generatePDF } from '../controllers/aiController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Generate slides based on prompt
router.post('/generate', protect, generateSlides);

// Edit slides via prompt
router.post('/edit', protect, editSlides);

// Generate PPTX file from JSON
router.post('/ppt', protect, generatePPT);
router.post("/pdf", protect, generatePDF);

export default router;
