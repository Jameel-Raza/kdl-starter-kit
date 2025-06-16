import { Router } from 'express';
import {
  getUsers, 
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  getUsersWithRoles,
} from '../controllers/userController.js';

const router = Router();

// Specific routes first
router.get('/debug_roles', getUsersWithRoles);

// Then parameterized routes
router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);        
router.post('/login', loginUser);
router.put('/:id', updateUser);      
router.delete('/:id', deleteUser);   

export default router;
