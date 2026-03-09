import express from 'express';
import { generatePdf } from '../controllers/pdfController.js';

const router = express.Router();

router.post('/generate', generatePdf);

export default router;
