import { Router } from 'express';
import { userController } from '../controllers/user.controller';

const router = Router();

// GET /api/users
router.get('/', userController.getUsers);

// POST /api/users/add -> /api/users
// Keeping /api/users and /api/users/add per backend rules or front end, but wait:
// "POST /api/users (Expects: name, mobile, email. Business logic: mobile becomes password)."
router.post('/', userController.addUser);

// Adding /add alias just in case the frontend relies on it as written in prompt context earlier 
// but the architecture required says "POST /api/users". 
router.post('/add', userController.addUser);

export default router;
