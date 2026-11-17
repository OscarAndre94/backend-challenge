import { Router } from 'express';
import userRoutes from '../users/users.routes.js';
import statesRoutes from './states.routes.js';

const router = Router();

router.use('/users', userRoutes);
router.use('/states', statesRoutes);

export default router;