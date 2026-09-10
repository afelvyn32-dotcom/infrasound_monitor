import express from 'express';
import { getUsers, updateUserRole, toggleUserStatus, deleteUser } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('ADMIN')); // All user management endpoints are admin-restricted

router.get('/', getUsers);
router.put('/:id/role', updateUserRole);
router.put('/:id/status', toggleUserStatus);
router.delete('/:id', deleteUser);

export default router;
