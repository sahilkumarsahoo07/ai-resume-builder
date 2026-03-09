import express from 'express';
import { getResumes, getResumeById, createResume, updateResume, deleteResume } from '../controllers/resumeController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getResumes)
    .post(protect, createResume);

router.route('/:id')
    .get(protect, getResumeById)
    .put(protect, updateResume)
    .delete(protect, deleteResume);

export default router;
