import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// GET /api/users - All authenticated users can see members (for task assignment dropdowns)
router.get('/', requireAuth, userController.getUsers);

// POST /api/users - Admin only
router.post('/', requireAuth, requireAdmin, userController.addUser);

// PUT /api/users/change-password - Any authenticated user can change their own password
router.put('/change-password', requireAuth, userController.changePassword);

export default router;
