import { Router } from 'express';
import { 
  getAllCalendarios, 
  getCalendarioById, 
  createCalendario, 
  updateCalendario,
  deleteCalendario 
} from '../controller/calendario-academico.controller.js';

const router = Router();

// Endpoints CRUD para la gestión del Calendario Académico
router.get('/', getAllCalendarios);
router.get('/:id', getCalendarioById);
router.post('/', createCalendario);
router.put('/:id', updateCalendario);
router.delete('/:id', deleteCalendario);

export default router;
