import express from 'express';
import { enhanceContent, getAtsScore, getJobMatch, getKeywords, getTailoredResume } from '../controllers/aiController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/enhance', protect, enhanceContent);
router.post('/ats-score', protect, getAtsScore);
router.post('/job-match', protect, getJobMatch);
router.post('/extract-keywords', protect, getKeywords);
router.post('/tailor-resume', protect, getTailoredResume);

export default router;
