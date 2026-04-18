import express from 'express';
import { getJobs, getJobById, createJob } from '../controllers/jobController.js';
import { protect, employer } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getJobs)
  .post(protect, employer, createJob);

router.route('/:id')
  .get(getJobById);

export default router;
