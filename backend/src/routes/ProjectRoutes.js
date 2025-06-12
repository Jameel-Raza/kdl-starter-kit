import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import {
  getProjectsList, 
  getProjectsById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/ProjectsController.js';

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/projects');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get('/', getProjectsList);       
router.get('/:id', getProjectsById);     
router.post('/', upload.single('pdf_attachment'), createProject);        
router.put('/:id', upload.single('pdf_attachment'), updateProject);      
router.delete('/:id', deleteProject);   

export default router;
