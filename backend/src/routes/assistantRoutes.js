import { Router } from 'express';
import { queryAssistant } from '../controllers/assistantController.js';

const router = Router();

router.post('/query', queryAssistant);

export default router;