import { Router } from 'express';
import {
  getProjectsList, 
  getProjectsById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/ProjectsController.js';

const router = Router();

router.get('/', getProjectsList);       
router.get('/:id', getProjectsById);     
router.post('/', createProject);        
router.put('/:id', updateProject);      
router.delete('/:id', deleteProject);   

export default router;
