import express from 'express';
import getHealth from '../controllers/healthController.js';
import { auth } from '../middleware/auth.js';
import { role } from '../middleware/role.js';

const router = express.Router();

router.get('/health', auth, role('admin'), getHealth);

export default router;
