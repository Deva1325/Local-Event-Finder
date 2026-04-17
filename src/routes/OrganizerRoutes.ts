import express from 'express';
import { bearerToken } from '../middleware/bearerToken';
import { getOrganizerDashboard } from '../controllers/OrganizerController';

const router = express.Router();

router.get('/dashboard', bearerToken, getOrganizerDashboard);

export default router;